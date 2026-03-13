import { motion } from "framer-motion";
import { Share2, Target, Monitor, Palette } from "lucide-react";

const floatingCards = [
  { icon: Share2, label: "Social Media", delay: 0, color: "from-neon-blue/20 to-neon-purple/20" },
  { icon: Target, label: "Meta Ads", delay: 0.15, color: "from-neon-purple/20 to-neon-cyan/20" },
  { icon: Monitor, label: "Web Design", delay: 0.3, color: "from-neon-cyan/20 to-neon-blue/20" },
  { icon: Palette, label: "Creative Design", delay: 0.45, color: "from-neon-blue/20 to-neon-cyan/20" },
];

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden grid-bg">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neon-purple/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Impulsa tu negocio con estrategias digitales que{" "}
            <span className="gradient-text">realmente convierten.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Diseño, publicidad y desarrollo digital para marcas que quieren crecer online con estrategia, creatividad y tecnología.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="px-7 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow">
              Get a Proposal
            </a>
            <a href="#services" className="px-7 py-3 rounded-lg glass-panel glass-panel-hover text-foreground font-semibold text-sm transition-all duration-300">
              Explore Services
            </a>
          </div>
        </motion.div>

        {/* Right - floating cards */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[420px]">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + card.delay }}
              className={`absolute glass-panel rounded-2xl p-6 card-lift ${
                i === 0 ? "top-0 left-4 animate-float" :
                i === 1 ? "top-8 right-4 animate-float-delayed" :
                i === 2 ? "bottom-8 left-8 animate-float-delayed" :
                "bottom-0 right-12 animate-float"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-heading font-semibold text-sm text-foreground">{card.label}</p>
            </motion.div>
          ))}
          {/* Central glow */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-neon-blue/10 via-neon-purple/10 to-neon-cyan/10 blur-[60px] animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
