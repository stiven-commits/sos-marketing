import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

const getClientIp = (req: { headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string | undefined } }) => {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || "";
};

const verifyRecaptcha = async (token: string, secret?: string, clientIp?: string) => {
  if (!secret) {
    return { ok: false, error: "Falta RECAPTCHA_SECRET_KEY en el entorno.", status: 500 };
  }

  if (!token) {
    return { ok: false, error: "reCAPTCHA es obligatorio.", status: 400 };
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  if (clientIp) {
    params.set("remoteip", clientIp);
  }

  const verifyResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!verifyResponse.ok) {
    return { ok: false, error: "No se pudo validar reCAPTCHA.", status: 502 };
  }

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) {
    return { ok: false, error: "La validacion de reCAPTCHA fallo.", status: 400 };
  }

  return { ok: true, status: 200 };
};

function contactApiDevPlugin(apiKey?: string, recaptchaSecret?: string): Plugin {
  return {
    name: "contact-api-dev-plugin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const payload = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          const { name, email, service, message, recaptchaToken } = payload;
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: "Falta RESEND_API_KEY en el entorno." }));
            return;
          }

          const clientIp = getClientIp(req);
          const recaptchaResult = await verifyRecaptcha(recaptchaToken, recaptchaSecret, clientIp);
          if (!recaptchaResult.ok) {
            res.statusCode = recaptchaResult.status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: recaptchaResult.error }));
            return;
          }

          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Web <atencion@sosmarketing.agency>",
              to: ["atencion@sosmarketing.agency"],
              subject: "Nuevo mensaje desde la web",
              html: `
                <h2>Nuevo mensaje</h2>
                <p><b>Nombre:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Servicio:</b> ${service || "No especificado"}</p>
                <p><b>Mensaje:</b> ${message}</p>
              `,
            }),
          });

          if (!resendResponse.ok) {
            const errorText = await resendResponse.text();
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: errorText || "Error al enviar el correo." }));
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: false, error: "No se pudo procesar la solicitud." }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  const recaptchaSecretKey = env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY;

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger(), contactApiDevPlugin(resendApiKey, recaptchaSecretKey)].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
