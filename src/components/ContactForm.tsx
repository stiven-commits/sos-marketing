import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const serviceOptions = [
  "Gestion de Redes Sociales",
  "Meta Ads",
  "Diseno Grafico",
  "Desarrollo Web",
  "Fotografia",
  "Produccion de Video",
];

const ContactForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        service: form.service,
        message: form.message,
      }),
    });

    if (res.ok) {
      setForm({ name: "", email: "", service: "", message: "" });
      navigate("/gracias");
    }
  };

  return (
    <section id="contact" className="py-24 lg:py-32 relative section-glow">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            <span className="gradient-text">Contáctanos</span>
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-8 lg:p-10 space-y-5 glow-purple"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Correo</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Servicio de interes</label>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Selecciona un servicio</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Mensaje</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
              placeholder="Cuentanos sobre tu proyecto..."
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow"
          >
            <Send className="w-4 h-4" />
            Enviar mensaje
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
