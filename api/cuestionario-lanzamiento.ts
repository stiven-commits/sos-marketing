import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

const verifyRecaptcha = async (token: string, requestIp: string) => {
  if (!recaptchaSecret) {
    return { ok: false, error: "Falta RECAPTCHA_SECRET_KEY en el servidor.", status: 500 };
  }

  if (!token) {
    return { ok: false, error: "reCAPTCHA es obligatorio.", status: 400 };
  }

  const params = new URLSearchParams({
    secret: recaptchaSecret,
    response: token,
  });

  if (requestIp) {
    params.set("remoteip", requestIp);
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

  return { ok: true };
};

const field = (label: string, value: unknown) => `<p><b>${label}:</b> ${String(value || "")}</p>`;

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const requestIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    const recaptchaResult = await verifyRecaptcha(payload?.recaptchaToken, requestIp);
    if (!recaptchaResult.ok) {
      return Response.json({ success: false, error: recaptchaResult.error }, { status: recaptchaResult.status });
    }

    await resend.emails.send({
      from: "Web <atencion@sosmarketing.agency>",
      to: ["atencion@sosmarketing.agency"],
      subject: "Nuevo cuestionario - Lanzamiento de Marca",
      html: `
        <h2>Cuestionario de Diagnostico y Estrategia</h2>
        <h3>1. El Producto y su Promesa Estrella</h3>
        ${field("Nombre comercial", payload?.nombreProducto)}
        ${field("Promesa 9 segundos", payload?.promesa9s)}
        ${field("Composicion tecnica", payload?.composicion)}
        ${field("Diferenciador clave", payload?.diferenciador)}
        ${field("Certificaciones", payload?.certificaciones)}

        <h3>2. El Mercado y la Competencia</h3>
        ${field("Situacion actual", payload?.situacionActual)}
        ${field("Competencia local", payload?.competenciaLocal)}
        ${field("Ventaja competitiva", payload?.ventajaCompetitiva)}

        <h3>3. El Cliente Ideal (Buyer Persona)</h3>
        ${field("Comprador principal", payload?.compradorPrincipal)}
        ${field("Perfil", payload?.perfil)}
        ${field("Ciudades foco", payload?.ciudadesFoco)}

        <h3>4. Objetivos de Negocio y Logistica</h3>
        ${field("Meta corto plazo", payload?.metaCortoPlazo)}
        ${field("Canales de venta", payload?.canalesVenta)}
        ${field("Logistica de envio", payload?.logisticaEnvio)}

        <h3>5. Identidad y Voz de Marca</h3>
        ${field("Personalidad", payload?.personalidadMarca)}
        ${field("Recursos visuales", payload?.recursosVisuales)}
        ${field("Presupuesto de inversion", payload?.presupuestoInversion)}
      `,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "No se pudo enviar el cuestionario." }, { status: 500 });
  }
}
