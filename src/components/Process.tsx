import { motion } from "framer-motion";
import { Lightbulb, PenTool, Rocket, BarChart3 } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Strategy", desc: "Analizamos tu negocio y definimos una estrategia digital clara.", color: "text-neon-blue" },
  { icon: PenTool, title: "Design", desc: "Creamos contenido visual y comunicación alineada con tu marca.", color: "text-neon-purple" },
  { icon: Rocket, title: "Launch", desc: "Implementamos campañas y activos digitales.", color: "text-neon-cyan" },
  { icon: BarChart3, title: "Optimization", desc: "Medimos resultados y optimizamos continuamente.", color: "text-neon-blue" },
];

const Process = () => {
  return (
    <section id="process" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Cómo <span className="gradient-text">trabajamos</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-panel glass-panel-hover rounded-2xl p-6 lg:p-8 card-lift text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-2">0{i + 1}</div>
              <h3 className="font-heading font-semibold text-lg mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
