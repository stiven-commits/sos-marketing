import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroBackground from "./HeroBackground";

/* ── 3D Glass Illustrations (SVG + CSS) ── */

const SocialMediaIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Glow backdrop */}
    <div className="absolute w-24 h-24 rounded-full bg-neon-blue/20 blur-[30px] animate-glow-pulse" />
    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10" fill="none">
      {/* Glowing connection lines */}
      <line x1="35" y1="45" x2="60" y2="30" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="60" y1="30" x2="85" y2="50" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="35" y1="45" x2="50" y2="75" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="85" y1="50" x2="70" y2="80" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="50" y1="75" x2="70" y2="80" stroke="url(#lineGrad1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Nodes */}
      <circle cx="60" cy="30" r="12" fill="url(#nodeGrad1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <circle cx="60" cy="30" r="6" fill="rgba(79,140,255,0.4)" />
      <circle cx="35" cy="45" r="9" fill="url(#nodeGrad2)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="35" cy="45" r="4" fill="rgba(123,109,255,0.4)" />
      <circle cx="85" cy="50" r="10" fill="url(#nodeGrad1)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="85" cy="50" r="5" fill="rgba(73,227,255,0.4)" />
      <circle cx="50" cy="75" r="8" fill="url(#nodeGrad2)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="50" cy="75" r="3.5" fill="rgba(79,140,255,0.35)" />
      <circle cx="70" cy="80" r="7" fill="url(#nodeGrad1)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="70" cy="80" r="3" fill="rgba(123,109,255,0.35)" />
      {/* Pulse rings */}
      <circle cx="60" cy="30" r="18" stroke="rgba(79,140,255,0.15)" strokeWidth="0.5" className="animate-[ping_3s_ease-in-out_infinite]" />
      <defs>
        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#49E3FF" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="nodeGrad1" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(79,140,255,0.08)" />
        </radialGradient>
        <radialGradient id="nodeGrad2" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(123,109,255,0.08)" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const MetaAdsIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute w-20 h-20 rounded-full bg-neon-purple/20 blur-[25px] animate-glow-pulse" />
    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10" fill="none">
      {/* Orbit rings */}
      <ellipse cx="60" cy="60" rx="42" ry="16" stroke="url(#orbitGrad)" strokeWidth="1" transform="rotate(-20 60 60)" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="-20 60 60" to="340 60 60" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="60" cy="60" rx="35" ry="22" stroke="url(#orbitGrad2)" strokeWidth="0.8" transform="rotate(40 60 60)" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="40 60 60" to="-320 60 60" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="60" cy="60" rx="48" ry="12" stroke="url(#orbitGrad)" strokeWidth="0.6" transform="rotate(70 60 60)" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="70 60 60" to="430 60 60" dur="20s" repeatCount="indefinite" />
      </ellipse>
      {/* Target center */}
      <circle cx="60" cy="60" r="20" fill="url(#targetGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="60" cy="60" r="13" stroke="rgba(123,109,255,0.3)" strokeWidth="1" fill="none" />
      <circle cx="60" cy="60" r="6" fill="rgba(123,109,255,0.5)" />
      <circle cx="60" cy="60" r="2.5" fill="rgba(255,255,255,0.6)" />
      {/* Orbiting dots */}
      <circle r="3" fill="#4F8CFF" opacity="0.7">
        <animateMotion dur="12s" repeatCount="indefinite" path="M60,60 m-42,0 a42,16 0 1,0 84,0 a42,16 0 1,0 -84,0" />
      </circle>
      <circle r="2.5" fill="#49E3FF" opacity="0.6">
        <animateMotion dur="15s" repeatCount="indefinite" path="M60,60 m-35,0 a35,22 0 1,1 70,0 a35,22 0 1,1 -70,0" />
      </circle>
      <defs>
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B6DFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="orbitGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#49E3FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7B6DFF" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="targetGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(123,109,255,0.06)" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const WebDesignIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute w-20 h-20 rounded-full bg-neon-cyan/15 blur-[25px] animate-glow-pulse" />
    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10" fill="none">
      {/* Browser frame */}
      <rect x="18" y="22" width="84" height="76" rx="6" fill="url(#browserGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Title bar */}
      <rect x="18" y="22" width="84" height="14" rx="6" fill="rgba(255,255,255,0.06)" />
      <rect x="18" y="30" width="84" height="6" fill="rgba(255,255,255,0.06)" />
      {/* Dots */}
      <circle cx="27" cy="29" r="2" fill="#FF5F57" opacity="0.7" />
      <circle cx="34" cy="29" r="2" fill="#FEBC2E" opacity="0.7" />
      <circle cx="41" cy="29" r="2" fill="#28C840" opacity="0.7" />
      {/* Layout blocks */}
      <rect x="24" y="42" width="36" height="6" rx="1.5" fill="url(#blockGrad1)" opacity="0.6" />
      <rect x="24" y="52" width="72" height="16" rx="3" fill="url(#blockGrad2)" opacity="0.35" stroke="rgba(73,227,255,0.15)" strokeWidth="0.5" />
      <rect x="24" y="72" width="22" height="18" rx="2" fill="url(#blockGrad3)" opacity="0.3" stroke="rgba(79,140,255,0.12)" strokeWidth="0.5" />
      <rect x="49" y="72" width="22" height="18" rx="2" fill="url(#blockGrad3)" opacity="0.25" stroke="rgba(123,109,255,0.12)" strokeWidth="0.5" />
      <rect x="74" y="72" width="22" height="18" rx="2" fill="url(#blockGrad3)" opacity="0.3" stroke="rgba(73,227,255,0.12)" strokeWidth="0.5" />
      {/* Glow accents */}
      <rect x="26" y="55" width="14" height="3" rx="1" fill="rgba(73,227,255,0.4)" />
      <rect x="26" y="61" width="28" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
      <defs>
        <radialGradient id="browserGrad" cx="40%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(73,227,255,0.03)" />
        </radialGradient>
        <linearGradient id="blockGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#49E3FF" />
          <stop offset="100%" stopColor="#4F8CFF" />
        </linearGradient>
        <linearGradient id="blockGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(73,227,255,0.15)" />
          <stop offset="100%" stopColor="rgba(79,140,255,0.05)" />
        </linearGradient>
        <linearGradient id="blockGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(79,140,255,0.04)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const CreativeDesignIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute w-20 h-20 rounded-full bg-neon-purple/15 blur-[25px] animate-glow-pulse" />
    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10" fill="none">
      {/* Central orb */}
      <circle cx="60" cy="58" r="22" fill="url(#orbGrad)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="60" cy="58" r="15" fill="url(#orbInner)" opacity="0.6" />
      <circle cx="53" cy="52" r="5" fill="rgba(255,255,255,0.08)" />
      {/* Floating shapes */}
      <rect x="22" y="28" width="16" height="16" rx="4" fill="url(#shapeGrad1)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" transform="rotate(15 30 36)" opacity="0.7">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="4s" repeatCount="indefinite" />
      </rect>
      <polygon points="88,30 96,44 80,44" fill="url(#shapeGrad2)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" opacity="0.6">
        <animateTransform attributeName="transform" type="translate" values="0,0; 0,5; 0,0" dur="5s" repeatCount="indefinite" />
      </polygon>
      <circle cx="30" cy="82" r="8" fill="url(#shapeGrad3)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" opacity="0.6">
        <animateTransform attributeName="transform" type="translate" values="0,0; 3,-3; 0,0" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <rect x="80" y="72" width="14" height="14" rx="7" fill="url(#shapeGrad1)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0; -2,4; 0,0" dur="5.5s" repeatCount="indefinite" />
      </rect>
      {/* Sparkle dots */}
      <circle cx="45" cy="25" r="1.5" fill="rgba(79,140,255,0.6)" className="animate-glow-pulse" />
      <circle cx="95" cy="58" r="1.5" fill="rgba(73,227,255,0.5)" className="animate-glow-pulse" style={{ animationDelay: "1s" }} />
      <circle cx="50" cy="95" r="1" fill="rgba(123,109,255,0.5)" className="animate-glow-pulse" style={{ animationDelay: "2s" }} />
      <defs>
        <radialGradient id="orbGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="50%" stopColor="rgba(123,109,255,0.1)" />
          <stop offset="100%" stopColor="rgba(79,140,255,0.05)" />
        </radialGradient>
        <radialGradient id="orbInner" cx="45%" cy="40%">
          <stop offset="0%" stopColor="rgba(123,109,255,0.25)" />
          <stop offset="100%" stopColor="rgba(73,227,255,0.08)" />
        </radialGradient>
        <linearGradient id="shapeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(79,140,255,0.3)" />
          <stop offset="100%" stopColor="rgba(123,109,255,0.1)" />
        </linearGradient>
        <linearGradient id="shapeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(123,109,255,0.35)" />
          <stop offset="100%" stopColor="rgba(73,227,255,0.1)" />
        </linearGradient>
        <linearGradient id="shapeGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(73,227,255,0.3)" />
          <stop offset="100%" stopColor="rgba(79,140,255,0.1)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* ── Floating Card with per-card hover tracking ── */
const FloatingCard = ({
  label,
  delay,
  position,
  index,
  globalMouse,
}: {
  label: string;
  delay: number;
  position: string;
  index: number;
  globalMouse: { x: number; y: number };
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [local, setLocal] = useState({ x: 0, y: 0 });
  const Illustration = illustrations[label];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setLocal({ x, y });
  };

  // Global parallax (different depth per card)
  const depth = 1 + index * 0.6;
  const gx = globalMouse.x * 10 * depth;
  const gy = globalMouse.y * 7 * depth;

  // Per-card tilt (max 8deg), only on hover
  const tiltX = hover ? local.y * -8 : globalMouse.y * -(2 + index);
  const tiltY = hover ? local.x * 8 : globalMouse.x * (2 + index);

  // Dynamic shadow shift
  const shadowX = (hover ? local.x : globalMouse.x) * 8;
  const shadowY = (hover ? local.y : globalMouse.y) * 8 + (hover ? 20 : 10);
  const shadowBlur = hover ? 40 : 20;
  const shadowOpacity = hover ? 0.35 : 0.15;

  // Glow intensity
  const glowOpacity = hover ? 0.25 : 0.08 + Math.abs(globalMouse.x + globalMouse.y) * 0.03;

  const floatY = Math.sin(Date.now() * 0.001 + index * 1.5) * 4;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setLocal({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 + delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`absolute ${position} w-[185px] cursor-default`}
      style={{ zIndex: hover ? 10 : 1 }}
    >
      <motion.div
        animate={{
          x: gx,
          y: gy + floatY,
          rotateX: tiltX,
          rotateY: tiltY,
          scale: hover ? 1.06 : 1,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
        style={{
          transformStyle: "preserve-3d",
          perspective: 800,
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`,
        }}
        className="rounded-2xl p-5 relative overflow-hidden"
      >
        {/* Glass background */}
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-500"
          style={{
            background: hover
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.06)",
            border: `1px solid rgba(255,255,255,${hover ? 0.22 : 0.12})`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />
        {/* Glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + (hover ? local.x : globalMouse.x) * 30}% ${50 + (hover ? local.y : globalMouse.y) * 30}%, rgba(79,140,255,${glowOpacity}), transparent 70%)`,
            opacity: 1,
          }}
        />
        {/* Shine reflection */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-700"
          style={{
            background: `linear-gradient(${135 + (hover ? local.x : 0) * 20}deg, rgba(255,255,255,${hover ? 0.08 : 0.03}) 0%, transparent 50%)`,
          }}
        />
        {/* Content */}
        <div className="relative z-10">
          <div className="w-full h-28 mb-3">
            <Illustration />
          </div>
          <p className="font-heading font-semibold text-sm text-foreground text-center">{label}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Hero ── */
const floatingCards = [
  { label: "Social Media", delay: 0 },
  { label: "Meta Ads", delay: 0.15 },
  { label: "Web Design", delay: 0.3 },
  { label: "Creative Design", delay: 0.45 },
];

const cardPositions = [
  "top-0 left-0",
  "top-4 right-0",
  "bottom-4 left-4",
  "bottom-0 right-8",
];

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x, y });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <HeroBackground />

      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
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

        {/* Right – 3D floating cards */}
        <div ref={containerRef} className="relative hidden lg:flex items-center justify-center min-h-[460px]">
          {floatingCards.map((card, i) => (
            <FloatingCard
              key={card.label}
              label={card.label}
              delay={card.delay}
              position={cardPositions[i]}
              index={i}
              globalMouse={mouse}
            />
          ))}
          {/* Central glow */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-neon-blue/10 via-neon-purple/10 to-neon-cyan/10 blur-[60px] animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
