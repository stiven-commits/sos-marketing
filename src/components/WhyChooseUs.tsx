import { motion } from "framer-motion";
import { Zap, Sparkles, TrendingUp, Shield } from "lucide-react";

const features = [
  { icon: Zap, title: "Marketing digital estrategico" },
  { icon: Sparkles, title: "Diseno creativo y branding" },
  { icon: TrendingUp, title: "Campanas enfocadas en conversion" },
  { icon: Shield, title: "Ejecucion digital profesional" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 lg:py-32 relative section-glow">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              Mas que <span className="gradient-text">marketing digital</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Trabajamos con marcas personales y empresas que quieren crecer digitalmente con una estrategia profesional, creativa y enfocada en resultados.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel glass-panel-hover rounded-xl p-5 card-lift flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-heading font-medium text-sm text-foreground">{f.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
