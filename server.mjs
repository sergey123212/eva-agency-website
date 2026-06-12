import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const cleanPath = normalize(decodeURIComponent(url.pathname))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(root, cleanPath === "" ? "index.html" : cleanPath);
  const filePath =
    existsSync(requestedPath) && statSync(requestedPath).isDirectory()
      ? join(requestedPath, "index.html")
      : requestedPath;

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`EVA Agency preview: http://localhost:${port}`);
});
