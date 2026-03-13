import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 45;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  hue: number;
}

const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.15,
        hue: Math.random() > 0.5 ? 211 : (Math.random() > 0.5 ? 0 : 190),
      }));
    };

    const draw = () => {
      time.current += 0.003;
      ctx.clearRect(0, 0, w, h);

      const beamCount = 3;
      for (let i = 0; i < beamCount; i++) {
        const angle = time.current * 0.15 + (i * Math.PI * 2) / beamCount;
        const cx = w * 0.5 + Math.cos(angle) * w * 0.15;
        const cy = h * 0.35 + Math.sin(angle * 0.7) * h * 0.1;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.7);
        const hue = i === 0 ? 211 : i === 1 ? 0 : 190;
        const sat = i === 1 ? "0%" : "80%";
        const pulse = 0.03 + Math.sin(time.current + i) * 0.015;
        grad.addColorStop(0, `hsla(${hue}, ${sat}, 60%, ${pulse})`);
        grad.addColorStop(0.5, `hsla(${hue}, ${sat}, 50%, ${pulse * 0.3})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const flicker = p.opacity + Math.sin(time.current * 2 + p.x * 0.01) * 0.1;
        const sat = p.hue === 0 ? "0%" : "80%";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, 70%, ${Math.max(0, flicker)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `hsla(${p.hue}, ${sat}, 65%, ${Math.max(0, flicker * 0.3)})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0B0F2A 0%, #0E1538 30%, #101A44 60%, #162050 100%)" }} />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,122,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,122,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full animate-glow-pulse"
        style={{ background: "radial-gradient(ellipse, rgba(0,122,255,0.07) 0%, rgba(98,98,98,0.04) 40%, transparent 70%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default HeroBackground;
