import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");

const PORT = Number(process.env.PORT || 8080);
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const sendJson = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
};

const safePathFromUrl = (urlPath) => {
  const normalized = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  return normalized.startsWith(path.sep) ? normalized.slice(1) : normalized;
};

const fileExists = async (fullPath) => {
  try {
    const info = await stat(fullPath);
    return info.isFile();
  } catch {
    return false;
  }
};

const serveFile = async (res, fullPath) => {
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  const file = await readFile(fullPath);
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  res.end(file);
};

const handleContact = async (req, res) => {
  try {
    if (!RESEND_API_KEY) {
      sendJson(res, 500, { success: false, error: "Falta RESEND_API_KEY en el servidor." });
      return;
    }

    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const payload = JSON.parse(body || "{}");
    const { name, email, service, message } = payload;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Web <atencion@sosmarketing.agency>",
        to: ["atencion@sosmarketing.agency"],
        subject: "Nuevo mensaje desde la web",
        html: `
          <h2>Nuevo mensaje</h2>
          <p><b>Nombre:</b> ${name || ""}</p>
          <p><b>Email:</b> ${email || ""}</p>
          <p><b>Servicio:</b> ${service || "No especificado"}</p>
          <p><b>Mensaje:</b> ${message || ""}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      sendJson(res, 500, { success: false, error: errText || "No se pudo enviar el mensaje." });
      return;
    }

    sendJson(res, 200, { success: true });
  } catch {
    sendJson(res, 500, { success: false, error: "Error interno al procesar la solicitud." });
  }
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === "/api/contact" && req.method === "POST") {
    await handleContact(req, res);
    return;
  }

  if (pathname === "/api/contact") {
    sendJson(res, 405, { success: false, error: "Metodo no permitido." });
    return;
  }

  const safeRelativePath = safePathFromUrl(pathname);
  const distCandidate = path.join(distDir, safeRelativePath);
  const publicCandidate = path.join(publicDir, safeRelativePath);

  if (await fileExists(distCandidate)) {
    await serveFile(res, distCandidate);
    return;
  }

  if (await fileExists(publicCandidate)) {
    await serveFile(res, publicCandidate);
    return;
  }

  const spaIndex = path.join(distDir, "index.html");
  if (await fileExists(spaIndex)) {
    await serveFile(res, spaIndex);
    return;
  }

  res.statusCode = 404;
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`SOS Marketing server running on http://localhost:${PORT}`);
});
