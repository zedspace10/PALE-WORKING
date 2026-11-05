const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const PORT = 4401;
const types = {
  ".mjs": "text/javascript",
  ".js": "text/javascript",
  ".html": "text/html",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
const server = http
  .createServer((req, res) => {
    const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(f)] || "application/octet-stream",
    });
    fs.createReadStream(f).pipe(res);
  })
  .listen(PORT);
(async () => {
  const b = await chromium.launch({
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--enable-unsafe-swiftshader",
    ],
  });
  const jobs = JSON.parse(process.argv[2]);
  for (const [page, scene, w, h, out, extra] of jobs) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errs.push(m.text());
    });
    await p.goto(
      `http://localhost:${PORT}/${page}?scene=${scene}&w=${w}&h=${h}${extra || ""}`,
    );
    await p.waitForFunction(() => window.done === true, null, {
      timeout: 120000,
    });
    await p.locator("canvas").screenshot({ path: out });
    console.log(out, errs.length ? errs : "ok");
    await p.close();
  }
  await b.close();
  server.close();
})();
