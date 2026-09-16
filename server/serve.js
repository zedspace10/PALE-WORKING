/** Defensive standalone server for Expo static builds. */
const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");
const QRCode = require("qrcode");

const {
  buildExpsTarget,
  getLandingOrigin,
  renderLandingPage,
  resolveStaticPath,
  stripBasePath,
  validateBasePath,
} = require("./helpers");

const DEFAULT_STATIC_ROOT = path.resolve(__dirname, "..", "static-build");
const DEFAULT_TEMPLATE_PATH = path.resolve(
  __dirname,
  "templates",
  "landing-page.html",
);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

function getAppName(appJsonPath) {
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
    return appJson.expo?.name || "App Landing Page";
  } catch {
    return "App Landing Page";
  }
}

function securityHeaders(nonce) {
  const scriptPolicy = nonce ? `'nonce-${nonce}'` : "'self'";
  return {
    "content-security-policy": [
      "default-src 'none'",
      `script-src ${scriptPolicy}`,
      "style-src 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
  };
}

function send(req, res, status, headers, body = "") {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body);
  res.writeHead(status, {
    ...securityHeaders(),
    ...headers,
    "content-length": payload.length,
  });
  if (req.method === "HEAD") res.end();
  else res.end(payload);
}

function serveManifest(req, res, staticRoot, platform) {
  const manifestPath = resolveStaticPath(
    staticRoot,
    `/${platform}/manifest.json`,
  );
  if (!manifestPath || !fs.existsSync(manifestPath)) {
    send(
      req,
      res,
      404,
      { "content-type": "application/json" },
      JSON.stringify({ error: "Manifest not found" }),
    );
    return;
  }
  send(
    req,
    res,
    200,
    {
      "content-type": "application/json; charset=utf-8",
      "expo-protocol-version": "1",
      "expo-sfv-version": "0",
    },
    fs.readFileSync(manifestPath),
  );
}

function serveStaticFile(req, res, staticRoot, urlPath) {
  const filePath = resolveStaticPath(staticRoot, urlPath);
  if (!filePath) {
    send(
      req,
      res,
      404,
      { "content-type": "text/plain; charset=utf-8" },
      "Not Found",
    );
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    send(
      req,
      res,
      404,
      { "content-type": "text/plain; charset=utf-8" },
      "Not Found",
    );
    return;
  }
  const contentType =
    MIME_TYPES[path.extname(filePath).toLowerCase()] ||
    "application/octet-stream";
  send(
    req,
    res,
    200,
    { "content-type": contentType },
    fs.readFileSync(filePath),
  );
}

async function defaultQrGenerator(deepLink) {
  return QRCode.toString(deepLink, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 0,
    width: 400,
    color: { dark: "#333333", light: "#ffffff" },
  });
}

function createAppServer(options = {}) {
  const env = options.env ?? process.env;
  const staticRoot = path.resolve(options.staticRoot ?? DEFAULT_STATIC_ROOT);
  const templatePath = options.templatePath ?? DEFAULT_TEMPLATE_PATH;
  const appJsonPath =
    options.appJsonPath ?? path.resolve(__dirname, "..", "app.json");
  const template = options.template ?? fs.readFileSync(templatePath, "utf8");
  const appName = options.appName ?? getAppName(appJsonPath);
  const basePath = validateBasePath(env.BASE_PATH || "/");
  const qrGenerator = options.qrGenerator ?? defaultQrGenerator;

  return http.createServer(async (req, res) => {
    try {
      if (req.method !== "GET" && req.method !== "HEAD") {
        send(
          req,
          res,
          405,
          { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD" },
          "Method Not Allowed",
        );
        return;
      }

      const url = new URL(req.url || "/", "http://localhost");
      const pathname = stripBasePath(url.pathname, basePath);
      if (pathname === null) {
        send(
          req,
          res,
          404,
          { "content-type": "text/plain; charset=utf-8" },
          "Not Found",
        );
        return;
      }

      if (pathname === "/" || pathname === "/manifest") {
        const platform = Array.isArray(req.headers["expo-platform"])
          ? null
          : req.headers["expo-platform"];
        if (platform === "ios" || platform === "android") {
          serveManifest(req, res, staticRoot, platform);
          return;
        }

        if (pathname === "/") {
          const origin = getLandingOrigin({
            publicOrigin: env.PUBLIC_ORIGIN,
            nodeEnv: env.NODE_ENV,
            trustProxy: env.TRUST_PROXY === "true",
            headers: req.headers,
          });
          const expsTarget = buildExpsTarget(origin, basePath);
          const deepLink = `exps://${expsTarget}`;
          const nonce = crypto.randomBytes(18).toString("base64");
          const html = renderLandingPage(template, {
            origin,
            expsTarget,
            appName,
            basePath,
            nonce,
            qrSvg: await qrGenerator(deepLink),
          });
          send(
            req,
            res,
            200,
            {
              ...securityHeaders(nonce),
              "content-type": "text/html; charset=utf-8",
            },
            html,
          );
          return;
        }
      }

      serveStaticFile(req, res, staticRoot, pathname);
    } catch (error) {
      const status =
        error instanceof Error &&
        /PUBLIC_ORIGIN|required in production|header|origin/i.test(
          error.message,
        )
          ? 400
          : 500;
      send(
        req,
        res,
        status,
        { "content-type": "text/plain; charset=utf-8" },
        status === 400 ? "Invalid request origin" : "Internal Server Error",
      );
    }
  });
}

function startServer(env = process.env) {
  const server = createAppServer({ env });
  const port = Number.parseInt(env.PORT || "3000", 10);
  server.listen(port, "0.0.0.0", () => {
    console.log(`Serving static Expo build on port ${port}`);
  });
  return server;
}

if (require.main === module) startServer();

module.exports = {
  createAppServer,
  defaultQrGenerator,
  getAppName,
  securityHeaders,
  serveStaticFile,
  startServer,
};
