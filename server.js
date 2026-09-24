const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const types = { ".css": "text/css", ".js": "text/javascript", ".html": "text/html", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };

http.createServer((request, response) => {
  const cleanPath = request.url.split("?")[0].replace(/^\/+/, "");
  const requestedRoute = cleanPath === "" ? "collaborate" : cleanPath;
  const candidate = path.resolve(root, requestedRoute);
  const file = fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()
    ? path.join(candidate, "index.html")
    : candidate;
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    response.writeHead(404); response.end("Not found"); return;
  }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
}).listen(3000, () => console.log("Prototype ready at http://localhost:3000/collaborate/"));
