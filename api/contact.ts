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

export async function POST(req: Request) {
  try {
    const { name, email, service, message, recaptchaToken } = await req.json();
    const requestIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    const recaptchaResult = await verifyRecaptcha(recaptchaToken, requestIp);
    if (!recaptchaResult.ok) {
      return Response.json({ success: false, error: recaptchaResult.error }, { status: recaptchaResult.status });
    }

    await resend.emails.send({
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
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: "No se pudo enviar el mensaje." }, { status: 500 });
  }
}
