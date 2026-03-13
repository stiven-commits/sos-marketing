import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Animated glow bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-purple/5 to-neon-cyan/10 animate-glow-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-blue/5 blur-[150px]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 lg:p-16 text-center max-w-3xl mx-auto glow-blue"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Haz crecer tu marca en <span className="gradient-text">internet</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Cuentanos sobre tu proyecto y te enviaremos una propuesta personalizada.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold btn-glow"
          >
            Solicitar propuesta
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
