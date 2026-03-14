import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, service, message } = await req.json();

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
