import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

function contactApiDevPlugin(apiKey?: string): Plugin {
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
          const { name, email, service, message } = payload;
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: "Falta RESEND_API_KEY en el entorno." }));
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

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger(), contactApiDevPlugin(resendApiKey)].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
