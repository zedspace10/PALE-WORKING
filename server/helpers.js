const path = require("path");

const HOST_PATTERN =
  /^(?:localhost|127(?:\.\d{1,3}){3}|\[(?:::1|0:0:0:0:0:0:0:1)\]|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})(?::\d{1,5})?$/i;

function singleHeader(value) {
  if (Array.isArray(value)) return value.length === 1 ? value[0] : null;
  return typeof value === "string" ? value : null;
}

function validateProtocol(value) {
  const protocol = singleHeader(value)?.trim().toLowerCase();
  if (protocol !== "http" && protocol !== "https") {
    throw new Error("Forwarded protocol must be http or https");
  }
  return protocol;
}

function validateHost(value, localhostOnly = false) {
  const host = singleHeader(value)?.trim();
  if (!host || host.includes(",") || !HOST_PATTERN.test(host)) {
    throw new Error("Host header is invalid");
  }
  const hostname = new URL(`http://${host}`).hostname.toLowerCase();
  const loopback =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname === "::1";
  if (localhostOnly && !loopback) {
    throw new Error("Only loopback development origins are allowed");
  }
  return host;
}

function validatePublicOrigin(value) {
  if (typeof value !== "string" || value.trim() !== value || !value) {
    throw new Error("PUBLIC_ORIGIN must be a non-empty absolute origin");
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("PUBLIC_ORIGIN is not a valid URL");
  }
  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      "PUBLIC_ORIGIN must contain only an http(s) scheme and host",
    );
  }
  return parsed.origin;
}

function validateBasePath(value = "/") {
  if (value === "/" || value === "") return "";
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.endsWith("/") ||
    value.includes("//") ||
    value.includes("%")
  ) {
    throw new Error("BASE_PATH must be / or a segment-safe absolute path");
  }
  const segments = value.slice(1).split("/");
  if (
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        !/^[A-Za-z0-9._~-]+$/.test(segment),
    )
  ) {
    throw new Error("BASE_PATH contains an invalid segment");
  }
  return value;
}

function stripBasePath(pathname, basePath) {
  if (!basePath) return pathname;
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`))
    return pathname.slice(basePath.length);
  return null;
}

function getLandingOrigin({ publicOrigin, nodeEnv, trustProxy, headers = {} }) {
  if (publicOrigin) return validatePublicOrigin(publicOrigin);
  if (nodeEnv === "production") {
    throw new Error("PUBLIC_ORIGIN is required in production");
  }

  if (trustProxy) {
    const protocol = validateProtocol(headers["x-forwarded-proto"]);
    const host = validateHost(headers["x-forwarded-host"], false);
    return `${protocol}://${host}`;
  }

  const host = validateHost(headers.host, true);
  return `http://${host}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderLandingPage(template, values) {
  return template
    .replace(/BASE_URL_PLACEHOLDER/g, escapeHtml(values.origin))
    .replace(/EXPS_URL_PLACEHOLDER/g, escapeHtml(values.expsTarget))
    .replace(/APP_NAME_PLACEHOLDER/g, escapeHtml(values.appName))
    .replace(/BASE_PATH_PLACEHOLDER/g, escapeHtml(values.basePath))
    .replace(/CSP_NONCE_PLACEHOLDER/g, escapeHtml(values.nonce))
    .replace(/QR_SVG_PLACEHOLDER/g, values.qrSvg);
}

function resolveStaticPath(staticRoot, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes("\0") || decoded.includes("\\")) return null;
  const relativeInput = decoded.replace(/^\/+/, "");
  const resolved = path.resolve(staticRoot, relativeInput);
  const relative = path.relative(staticRoot, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative))
    return null;
  return resolved;
}

function buildExpsTarget(origin, basePath) {
  const parsed = new URL(origin);
  return `${parsed.host}${basePath}`;
}

module.exports = {
  buildExpsTarget,
  escapeHtml,
  getLandingOrigin,
  renderLandingPage,
  resolveStaticPath,
  singleHeader,
  stripBasePath,
  validateBasePath,
  validateHost,
  validateProtocol,
  validatePublicOrigin,
};
