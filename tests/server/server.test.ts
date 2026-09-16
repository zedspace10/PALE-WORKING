import fs from "node:fs";
import http, { Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { afterEach, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const helpers =
  require("../../server/helpers.js") as typeof import("../../server/helpers.js");
const serverModule = require("../../server/serve.js") as {
  createAppServer(options: Record<string, unknown>): Server;
  defaultQrGenerator(value: string): Promise<string>;
};

const openServers: Server[] = [];
const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    openServers
      .splice(0)
      .map(
        (server) =>
          new Promise<void>((resolve) => server.close(() => resolve())),
      ),
  );
  for (const directory of tempDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

interface ResponseResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

async function request(
  server: Server,
  requestPath: string,
  options: { method?: string; headers?: Record<string, string> } = {},
): Promise<ResponseResult> {
  if (!server.listening) {
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    openServers.push(server);
  }
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No test port");
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: address.port,
        path: requestPath,
        method: options.method ?? "GET",
        headers: options.headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function fixtureServer(
  env: Record<string, string>,
  appName = "PALE",
): { server: Server; root: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pale-server-"));
  tempDirectories.push(root);
  fs.writeFileSync(path.join(root, "hello.txt"), "hello");
  for (const platform of ["ios", "android"]) {
    fs.mkdirSync(path.join(root, platform), { recursive: true });
    fs.writeFileSync(
      path.join(root, platform, "manifest.json"),
      JSON.stringify({ platform }),
    );
  }
  const template = [
    "<!doctype html><title>APP_NAME_PLACEHOLDER</title>",
    '<a href="exps://EXPS_URL_PLACEHOLDER">open</a>',
    "<div>QR_SVG_PLACEHOLDER</div>",
    '<script nonce="CSP_NONCE_PLACEHOLDER">window.ok=true</script>',
  ].join("");
  return {
    root,
    server: serverModule.createAppServer({
      env,
      staticRoot: root,
      template,
      appName,
      qrGenerator: async (deepLink: string) =>
        `<svg data-link="${helpers.escapeHtml(deepLink)}"></svg>`,
    }),
  };
}

describe("server origin and path helpers", () => {
  it("accepts configured origins and loopback development origins", () => {
    expect(helpers.validatePublicOrigin("https://pale.example")).toBe(
      "https://pale.example",
    );
    expect(
      helpers.getLandingOrigin({
        nodeEnv: "development",
        headers: { host: "localhost:3000" },
      }),
    ).toBe("http://localhost:3000");
  });

  it.each([
    "javascript:alert(1)",
    "https://good.example/path",
    "https://good.example/?query=1",
    "https://user:pass@good.example",
    " https://good.example",
  ])("rejects malformed public origin %s", (origin) => {
    expect(() => helpers.validatePublicOrigin(origin)).toThrow();
  });

  it("requires PUBLIC_ORIGIN in production and validates proxy tokens", () => {
    expect(() =>
      helpers.getLandingOrigin({
        nodeEnv: "production",
        headers: { host: "attacker.example" },
      }),
    ).toThrow(/required in production/);
    expect(() =>
      helpers.getLandingOrigin({
        nodeEnv: "development",
        trustProxy: true,
        headers: {
          "x-forwarded-proto": "javascript",
          "x-forwarded-host": "trusted.example",
        },
      }),
    ).toThrow(/protocol/);
  });

  it("enforces segment-safe base paths and root containment", () => {
    expect(helpers.validateBasePath("/pale/app")).toBe("/pale/app");
    expect(helpers.stripBasePath("/pale/app/file", "/pale/app")).toBe("/file");
    expect(helpers.stripBasePath("/pale/application", "/pale/app")).toBeNull();
    expect(() => helpers.validateBasePath("/pale/../secret")).toThrow();
    const root = path.resolve("C:/safe-root");
    expect(helpers.resolveStaticPath(root, "/../secret.txt")).toBeNull();
    expect(helpers.resolveStaticPath(root, "/%2e%2e/secret.txt")).toBeNull();
  });

  it("HTML-escapes substitutions but permits internally generated QR SVG", () => {
    const rendered = helpers.renderLandingPage(
      "APP_NAME_PLACEHOLDER EXPS_URL_PLACEHOLDER QR_SVG_PLACEHOLDER",
      {
        appName: '<img src=x onerror="x">',
        expsTarget: "safe.example",
        origin: "https://safe.example",
        basePath: "",
        nonce: "safe",
        qrSvg: '<svg id="trusted"></svg>',
      },
    );
    expect(rendered).toContain("&lt;img src=x onerror=&quot;x&quot;&gt;");
    expect(rendered).toContain('<svg id="trusted"></svg>');
  });
});

describe("static server integration", () => {
  it("keeps PUBLIC_ORIGIN authoritative over hostile request headers", async () => {
    const { server } = fixtureServer(
      {
        NODE_ENV: "production",
        PUBLIC_ORIGIN: "https://trusted.example",
        BASE_PATH: "/app",
      },
      '<img src=x onerror="alert(1)">',
    );
    const response = await request(server, "/app/", {
      headers: {
        host: "attacker.example",
        "x-forwarded-host": "forwarded-attacker.example",
        "x-forwarded-proto": "http",
      },
    });
    expect(response.status).toBe(200);
    expect(response.body).toContain("exps://trusted.example/app");
    expect(response.body).not.toContain("attacker.example");
    expect(response.body).toContain(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });

  it("rejects malformed trusted-proxy headers without reflection", async () => {
    const { server } = fixtureServer({
      NODE_ENV: "development",
      TRUST_PROXY: "true",
    });
    const response = await request(server, "/", {
      headers: {
        "x-forwarded-host": "good.example,<script>alert(1)</script>",
        "x-forwarded-proto": "https",
      },
    });
    expect(response.status).toBe(400);
    expect(response.body).not.toContain("script");
  });

  it("serves GET/HEAD safely and rejects methods, traversal, prefixes, and misses", async () => {
    const { server } = fixtureServer({
      NODE_ENV: "production",
      PUBLIC_ORIGIN: "https://trusted.example",
      BASE_PATH: "/app",
    });
    const get = await request(server, "/app/hello.txt");
    expect(get).toMatchObject({ status: 200, body: "hello" });
    expect(get.headers["content-type"]).toContain("text/plain");

    const head = await request(server, "/app/hello.txt", { method: "HEAD" });
    expect(head).toMatchObject({ status: 200, body: "" });
    expect(head.headers["content-length"]).toBe("5");

    expect(
      (await request(server, "/app/hello.txt", { method: "POST" })).status,
    ).toBe(405);
    expect((await request(server, "/application/hello.txt")).status).toBe(404);
    expect((await request(server, "/app/%2e%2e/hello.txt")).status).toBe(404);
    expect((await request(server, "/app/missing.txt")).status).toBe(404);
  });

  it("sets baseline security headers and serves platform manifests", async () => {
    const { server } = fixtureServer({
      NODE_ENV: "production",
      PUBLIC_ORIGIN: "https://trusted.example",
    });
    const landing = await request(server, "/");
    expect(landing.headers).toMatchObject({
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "referrer-policy": "no-referrer",
    });
    expect(landing.headers["content-security-policy"]).toMatch(
      /frame-ancestors 'none'/,
    );
    expect(landing.headers["content-security-policy"]).toMatch(/nonce-/);

    const manifest = await request(server, "/manifest", {
      headers: { "expo-platform": "ios" },
    });
    expect(manifest.status).toBe(200);
    expect(manifest.body).toContain('"platform":"ios"');
  });

  it("generates QR SVG locally with the pinned package", async () => {
    const svg = await serverModule.defaultQrGenerator(
      "exps://trusted.example/app",
    );
    expect(svg).toContain("<svg");
    expect(svg).not.toMatch(/https?:\/\/(?:unpkg|cdn|jsdelivr)/i);
    const template = fs.readFileSync(
      path.resolve(process.cwd(), "server/templates/landing-page.html"),
      "utf8",
    );
    expect(template).not.toMatch(/unpkg|qr-code-styling/i);
  });
});
