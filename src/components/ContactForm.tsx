import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const serviceOptions = [
  "Social Media",
  "Meta Ads",
  "Graphic Design",
  "Web Development",
  "Photography",
  "Video Production",
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", service: "", message: "" });
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
            <span className="gradient-text">Contact</span> Us
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Service Interest</label>
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Select a service</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactForm;
