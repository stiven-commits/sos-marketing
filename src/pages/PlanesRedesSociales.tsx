import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const plans = [
  {
    name: "Plan Impulso",
    price: "399.99",
    featured: false,
    features: [
      "8 publicaciones mensuales entre imágenes y reels",
      "Diseño de los 8 post/videos de 15s a 40s",
      "Copywriting del contenido",
      "Estrategia de redes Facebook e Instagram",
      "16 stories mensuales (pueden ser repetitivas)",
      "Rediseño de highlights/destacados",
      "Acceso a plataforma online para aprobar contenido",
    ],
    note: "TikTok y LinkedIn tienen costo adicional.",
  },
  {
    name: "Plan Rocket",
    price: "449.99",
    featured: true,
    label: "Most Popular",
    features: [
      "12 publicaciones mensuales entre imágenes y reels",
      "Diseño de los 12 post/videos de 15s a 40s",
      "Copywriting del contenido",
      "Estrategia de redes Facebook e Instagram",
      "21 stories mensuales",
      "Rediseño de highlights/destacados",
      "Acceso a plataforma online para aprobar contenido",
      "30 USD en grupo de anuncios por 30 días",
    ],
    note: "TikTok y LinkedIn tienen costo adicional.",
  },
  {
    name: "Plan Empresarial",
    price: "529.99",
    featured: false,
    features: [
      "16 publicaciones mensuales entre imágenes y reels",
      "Diseño de los 16 post/videos de 15s a 40s",
      "Copywriting del contenido",
      "Estrategia de redes Facebook e Instagram",
      "30 stories mensuales",
      "Rediseño de highlights/destacados",
      "Acceso a plataforma online para aprobar contenido",
      "60 USD en grupo de anuncios por 30 días",
    ],
    note: "TikTok y LinkedIn tienen costo adicional.",
  },
];

const PlanesRedesSociales = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden grid-bg">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-5"
          >
            Planes para gestión de{" "}
            <span className="gradient-text">redes sociales</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Elige el plan que mejor se adapte a tu negocio y comienza a crecer en redes con estrategia profesional.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-24 relative section-glow">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative glass-panel glass-panel-hover rounded-2xl p-6 lg:p-8 card-lift flex flex-col ${
                  plan.featured ? "ring-1 ring-primary/40 glow-blue" : ""
                }`}
              >
                {plan.label && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {plan.label}
                  </div>
                )}

                <h3 className="font-heading font-bold text-xl mb-2 text-foreground">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">USD / mes</span>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.note && (
                  <p className="text-xs text-muted-foreground/70 italic mb-5">
                    {plan.note}
                  </p>
                )}

                <a
                  href="https://wa.me/+584140170980"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    plan.featured
                      ? "bg-primary text-primary-foreground btn-glow"
                      : "glass-panel glass-panel-hover text-foreground"
                  }`}
                >
                  Solicitar propuesta
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-glow-pulse" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-10 lg:p-16 max-w-2xl mx-auto glow-blue"
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-6">
              ¿Listo para impulsar tus{" "}
              <span className="gradient-text">redes sociales</span>?
            </h2>
            <a
              href="https://wa.me/+584140170980"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold btn-glow"
            >
              Solicitar propuesta
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PlanesRedesSociales;
