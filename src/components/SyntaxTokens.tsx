import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TokenDef {
  shape: "diamond" | "circle" | "rect" | "squiggle" | "bracket" | "dot";
  color: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  driftX: number;
  delay: number;
}

const TOKENS: TokenDef[] = [
  { shape: "diamond", color: "#22D3EE", x: 8, y: 85, size: 8, duration: 12, driftX: 15, delay: 0 },
  { shape: "diamond", color: "#22D3EE", x: 18, y: 70, size: 6, duration: 14, driftX: -10, delay: 1.2 },
  { shape: "diamond", color: "#22D3EE", x: 28, y: 92, size: 7, duration: 16, driftX: 20, delay: 0.5 },
  { shape: "diamond", color: "#22D3EE", x: 42, y: 78, size: 5, duration: 13, driftX: -12, delay: 2 },
  { shape: "diamond", color: "#22D3EE", x: 55, y: 95, size: 9, duration: 15, driftX: 18, delay: 1 },
  { shape: "diamond", color: "#22D3EE", x: 65, y: 82, size: 6, duration: 11, driftX: -14, delay: 3 },
  { shape: "diamond", color: "#22D3EE", x: 75, y: 90, size: 7, duration: 17, driftX: 22, delay: 0.8 },
  { shape: "diamond", color: "#22D3EE", x: 88, y: 75, size: 5, duration: 14, driftX: -8, delay: 2.5 },
  { shape: "diamond", color: "#22D3EE", x: 95, y: 88, size: 8, duration: 13, driftX: 16, delay: 1.5 },
  { shape: "diamond", color: "#22D3EE", x: 48, y: 98, size: 6, duration: 12, driftX: -18, delay: 4 },
  { shape: "circle", color: "#818CF8", x: 5, y: 72, size: 7, duration: 18, driftX: -12, delay: 0.3 },
  { shape: "circle", color: "#818CF8", x: 15, y: 88, size: 5, duration: 15, driftX: 14, delay: 1.8 },
  { shape: "circle", color: "#818CF8", x: 22, y: 76, size: 8, duration: 20, driftX: -16, delay: 2.2 },
  { shape: "circle", color: "#818CF8", x: 35, y: 91, size: 6, duration: 14, driftX: 10, delay: 0.7 },
  { shape: "circle", color: "#818CF8", x: 45, y: 80, size: 7, duration: 19, driftX: -20, delay: 3.5 },
  { shape: "circle", color: "#818CF8", x: 58, y: 93, size: 5, duration: 16, driftX: 12, delay: 1.3 },
  { shape: "circle", color: "#818CF8", x: 68, y: 78, size: 8, duration: 22, driftX: -14, delay: 4.2 },
  { shape: "circle", color: "#818CF8", x: 78, y: 95, size: 6, duration: 15, driftX: 18, delay: 0.2 },
  { shape: "circle", color: "#818CF8", x: 85, y: 83, size: 5, duration: 17, driftX: -10, delay: 2.8 },
  { shape: "circle", color: "#818CF8", x: 92, y: 96, size: 7, duration: 14, driftX: 20, delay: 1.9 },
  { shape: "rect", color: "#FF7A45", x: 3, y: 82, size: 5, duration: 13, driftX: 10, delay: 1.1 },
  { shape: "rect", color: "#FF7A45", x: 12, y: 94, size: 6, duration: 16, driftX: -14, delay: 3.2 },
  { shape: "rect", color: "#FF7A45", x: 25, y: 85, size: 4, duration: 14, driftX: 16, delay: 0.9 },
  { shape: "rect", color: "#FF7A45", x: 32, y: 96, size: 7, duration: 18, driftX: -8, delay: 2.6 },
  { shape: "rect", color: "#FF7A45", x: 48, y: 84, size: 5, duration: 12, driftX: 12, delay: 4.1 },
  { shape: "rect", color: "#FF7A45", x: 60, y: 97, size: 6, duration: 17, driftX: -18, delay: 1.4 },
  { shape: "rect", color: "#FF7A45", x: 72, y: 86, size: 4, duration: 15, driftX: 14, delay: 3.8 },
  { shape: "rect", color: "#FF7A45", x: 82, y: 92, size: 7, duration: 13, driftX: -10, delay: 0.6 },
  { shape: "rect", color: "#FF7A45", x: 90, y: 80, size: 5, duration: 19, driftX: 20, delay: 2.9 },
  { shape: "circle", color: "#3DDC97", x: 7, y: 90, size: 6, duration: 16, driftX: -16, delay: 2.3 },
  { shape: "circle", color: "#3DDC97", x: 20, y: 79, size: 5, duration: 14, driftX: 18, delay: 0.4 },
  { shape: "circle", color: "#3DDC97", x: 30, y: 94, size: 7, duration: 20, driftX: -12, delay: 3.1 },
  { shape: "circle", color: "#3DDC97", x: 40, y: 87, size: 4, duration: 13, driftX: 14, delay: 1.7 },
  { shape: "circle", color: "#3DDC97", x: 52, y: 96, size: 6, duration: 17, driftX: -20, delay: 4.5 },
  { shape: "circle", color: "#3DDC97", x: 62, y: 81, size: 5, duration: 15, driftX: 10, delay: 2.1 },
  { shape: "circle", color: "#3DDC97", x: 77, y: 93, size: 7, duration: 18, driftX: -14, delay: 0.1 },
  { shape: "circle", color: "#3DDC97", x: 87, y: 85, size: 5, duration: 12, driftX: 16, delay: 3.6 },
  { shape: "circle", color: "#3DDC97", x: 96, y: 90, size: 6, duration: 16, driftX: -10, delay: 1.6 },
  { shape: "diamond", color: "#C084FC", x: 10, y: 84, size: 5, duration: 15, driftX: 12, delay: 2.7 },
  { shape: "diamond", color: "#C084FC", x: 22, y: 71, size: 6, duration: 18, driftX: -16, delay: 0.2 },
  { shape: "diamond", color: "#C084FC", x: 34, y: 89, size: 4, duration: 14, driftX: 20, delay: 3.9 },
  { shape: "diamond", color: "#C084FC", x: 44, y: 97, size: 7, duration: 19, driftX: -12, delay: 1.3 },
  { shape: "diamond", color: "#C084FC", x: 56, y: 83, size: 5, duration: 13, driftX: 14, delay: 4.8 },
  { shape: "diamond", color: "#C084FC", x: 66, y: 94, size: 6, duration: 17, driftX: -18, delay: 2 },
  { shape: "diamond", color: "#C084FC", x: 76, y: 79, size: 5, duration: 16, driftX: 10, delay: 3.4 },
  { shape: "diamond", color: "#C084FC", x: 86, y: 91, size: 7, duration: 14, driftX: -14, delay: 0.9 },
  { shape: "diamond", color: "#C084FC", x: 94, y: 77, size: 4, duration: 15, driftX: 22, delay: 2.4 },
  { shape: "dot", color: "#22D3EE", x: 14, y: 86, size: 3, duration: 20, driftX: 5, delay: 0.6 },
  { shape: "dot", color: "#818CF8", x: 38, y: 88, size: 3, duration: 22, driftX: -6, delay: 1.8 },
  { shape: "dot", color: "#FF7A45", x: 50, y: 91, size: 3, duration: 18, driftX: 7, delay: 3 },
  { shape: "dot", color: "#3DDC97", x: 63, y: 87, size: 3, duration: 24, driftX: -5, delay: 0.4 },
  { shape: "dot", color: "#C084FC", x: 80, y: 89, size: 3, duration: 21, driftX: 6, delay: 2.2 },
  { shape: "dot", color: "#22D3EE", x: 45, y: 93, size: 3, duration: 19, driftX: -7, delay: 3.7 },
  { shape: "dot", color: "#818CF8", x: 70, y: 91, size: 3, duration: 23, driftX: 5, delay: 1.5 },
  { shape: "dot", color: "#FF7A45", x: 92, y: 84, size: 3, duration: 17, driftX: -6, delay: 4.2 },
  { shape: "dot", color: "#3DDC97", x: 5, y: 89, size: 3, duration: 25, driftX: 8, delay: 2.8 },
  { shape: "dot", color: "#C084FC", x: 55, y: 89, size: 3, duration: 20, driftX: -5, delay: 0.9 },
];

function generateExtraTokens(count: number): TokenDef[] {
  const shapes: TokenDef["shape"][] = ["diamond", "circle", "rect"];
  const colors = ["#22D3EE", "#818CF8", "#FF7A45", "#3DDC97", "#C084FC"];
  const tokens: TokenDef[] = [];
  for (let i = 0; i < count; i++) {
    tokens.push({
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      y: 75 + Math.random() * 25,
      size: 4 + Math.floor(Math.random() * 5),
      duration: 10 + Math.random() * 14,
      driftX: -20 + Math.random() * 40,
      delay: Math.random() * 5,
    });
  }
  return tokens;
}

const ALL_TOKENS = [...TOKENS, ...generateExtraTokens(15)];

function TokenShape({ token }: { token: TokenDef }) {
  const cx = token.size / 2;
  const style = { position: "absolute" as const };

  switch (token.shape) {
    case "diamond":
      return (
        <svg width={token.size} height={token.size} viewBox={`0 0 ${token.size} ${token.size}`} style={style}>
          <path d={`M${cx} 0 L${token.size} ${cx} L${cx} ${token.size} L0 ${cx}Z`} fill={token.color} />
        </svg>
      );
    case "circle":
      return (
        <svg width={token.size + 2} height={token.size + 2} viewBox={`0 0 ${token.size + 2} ${token.size + 2}`} style={style}>
          <circle cx={cx + 1} cy={cx + 1} r={token.size / 2} fill={token.color} />
        </svg>
      );
    case "rect":
      return (
        <svg width={token.size * 2} height={token.size} viewBox={`0 0 ${token.size * 2} ${token.size}`} style={style}>
          <rect width={token.size * 2} height={token.size} rx={1} fill={token.color} />
        </svg>
      );
    case "squiggle":
      return (
        <svg width={token.size * 2} height={token.size} viewBox={`0 0 ${token.size * 2} ${token.size}`} style={style}>
          <path d={`M0 ${token.size / 2} Q${token.size / 2} 0 ${token.size} ${token.size / 2} T${token.size * 2} ${token.size / 2}`} stroke={token.color} strokeWidth={1} fill="none" />
        </svg>
      );
    case "dot":
      return (
        <svg width={token.size} height={token.size} viewBox={`0 0 ${token.size} ${token.size}`} style={style}>
          <circle cx={cx} cy={cx} r={cx} fill={token.color} />
        </svg>
      );
    case "bracket":
      return (
        <svg width={token.size * 2} height={token.size} viewBox={`0 0 ${token.size * 2} ${token.size}`} style={style}>
          <path d={`M2 2L2 ${token.size - 2}M${token.size * 2 - 2} 2L${token.size * 2 - 2} ${token.size - 2}`} stroke={token.color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function SyntaxTokens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // ─── Mousemove listener ──────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ─── GSAP float + magnet rAF ─────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tokenEls = container.querySelectorAll<HTMLElement>(".syntax-token");
    const magnetEls = container.querySelectorAll<HTMLElement>(".token-magnet");

    // Current lerped magnet offsets per token
    const magnetOffsets: { x: number; y: number }[] = [];

    // Kick off GSAP float tweens
    tokenEls.forEach((el, i) => {
      const t = ALL_TOKENS[i];
      if (!t) return;

      magnetOffsets[i] = { x: 0, y: 0 };

      const driftDir = Math.random() > 0.5 ? 1 : -1;
      gsap.fromTo(
        el,
        { y: 0, x: 0, opacity: 0.65 },
        {
          y: -(300 + Math.random() * 150),
          x: t.driftX * driftDir,
          opacity: 0,
          duration: t.duration + Math.random() * 4,
          delay: t.delay,
          ease: "none",
          repeat: -1,
          repeatRefresh: true,
        },
      );

      if (t.shape === "diamond" || t.shape === "squiggle") {
        gsap.to(el, {
          rotation: 360,
          duration: t.duration * 1.5,
          ease: "none",
          repeat: -1,
        });
      }
    });

    // ─── rAF: magnet pull ──────────────────────────────
    const MAGNET_RADIUS = 280;
    const MAX_PULL = 30;
    const LERP_SPEED = 0.12;

    let animFrame: number;

    const updateMagnet = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      tokenEls.forEach((el, i) => {
        const magnetEl = magnetEls[i];
        const offset = magnetOffsets[i];
        if (!magnetEl || !offset) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = 0;
        let targetY = 0;

        if (dist < MAGNET_RADIUS && dist > 1) {
          const strength = 1 - dist / MAGNET_RADIUS;
          const pull = strength * strength * MAX_PULL;
          const angle = Math.atan2(dy, dx);
          targetX = Math.cos(angle) * pull;
          targetY = Math.sin(angle) * pull;
        }

        // Lerp toward target
        offset.x += (targetX - offset.x) * LERP_SPEED;
        offset.y += (targetY - offset.y) * LERP_SPEED;

        if (Math.abs(offset.x) > 0.5 || Math.abs(offset.y) > 0.5) {
          magnetEl.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
          magnetEl.style.transition = "none";
        } else if (offset.x !== 0 || offset.y !== 0) {
          offset.x = 0;
          offset.y = 0;
          magnetEl.style.transform = "translate(0px, 0px)";
        }
      });

      animFrame = requestAnimationFrame(updateMagnet);
    };

    animFrame = requestAnimationFrame(updateMagnet);

    return () => {
      gsap.killTweensOf(tokenEls);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {ALL_TOKENS.map((token, i) => (
        <div
          key={i}
          className="syntax-token absolute"
          style={{
            left: `${token.x}%`,
            top: `${token.y}%`,
            opacity: 0.65,
          }}
        >
          <div className="token-magnet will-change-transform">
            <TokenShape token={token} />
          </div>
        </div>
      ))}
    </div>
  );
}
