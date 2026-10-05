// Serves `app/` and one endpoint that fails on purpose.
//
// Dependency-free, because a template should not start with a package graph
// nobody chose. Path traversal is rejected before the filesystem sees the
// request: a server that joins a request path onto a root has to check that
// the result is still under that root.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "app");
const PORT = Number(process.env.PORT ?? 4317);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${PORT}`);

  if (url.pathname === "/api/summary") {
    response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "billing service unavailable" }));
    return;
  }

  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const target = path.join(ROOT, path.normalize(requested));
  if (!target.startsWith(ROOT + path.sep)) {
    response.writeHead(403, { "content-type": "text/plain" });
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(target);
    response.writeHead(200, {
      "content-type": TYPES[path.extname(target)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`serving app/ at http://127.0.0.1:${PORT}`);
});
