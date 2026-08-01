import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HandwritingText from "./HandwritingText";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const ACCENT = "#EF4444";

// ─── Data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: 25, suffix: "+", label: "Projects" },
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 100, suffix: "+", label: "GitHub Repositories" },
  { value: 500, suffix: "K+", label: "Lines of Code" },
];

const TECH_LOGOS: { name: string; img: string }[] = [
  { name: "JavaScript", img: "https://i.postimg.cc/SQgqpxmc/js.png" },
  { name: "React", img: "https://i.postimg.cc/yNjpSWQP/react.png" },
  { name: "Node.js", img: "https://i.postimg.cc/fLFGJJyP/nodejs.png" },
  { name: "Express", img: "https://i.postimg.cc/cHKjy0hB/express-js.png" },
  { name: "MongoDB", img: "https://i.postimg.cc/y8tcpKJH/mongodb.png" },
  { name: "Tailwind CSS", img: "https://i.postimg.cc/jdCDp9Yd/tailwindcss.png" },
  { name: "Sass", img: "https://i.postimg.cc/rpn88ykd/saddd-1.png" },
  { name: "Figma", img: "https://i.postimg.cc/FRB43TWD/figma.png" },
  { name: "Three.js", img: "https://i.postimg.cc/ZqYnLDHS/three-js.png" },
  { name: "Framer Motion", img: "https://cdn.simpleicons.org/framer" },
  { name: "GSAP", img: "https://cdn.simpleicons.org/greensock" },
  { name: "SQL", img: "https://cdn.simpleicons.org/mysql" },
  { name: "Lenis", img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12h18M12 3v18M9 6l3-3 3 3M15 18l-3 3-3-3M18 9l3 3-3 3M6 15l-3-3 3-3'/%3E%3C/svg%3E" },
  { name: "TypeScript", img: "https://cdn.simpleicons.org/typescript" },
  { name: "Next.js", img: "https://cdn.simpleicons.org/nextdotjs" },
  { name: "Git", img: "https://cdn.simpleicons.org/git" },
];

const EXPERTISE = [
  { icon: "⚡", label: "UI Engineering" },
  { icon: "🏗️", label: "Frontend Architecture" },
  { icon: "🎬", label: "Animations" },
  { icon: "📈", label: "Performance" },
  { icon: "📱", label: "Responsive Design" },
  { icon: "♿", label: "Accessibility" },
  { icon: "🔗", label: "API Integration" },
  { icon: "🎨", label: "Design Systems" },
];

const PINNED_REPOS = [
  { name: "Portfolio", lang: "TypeScript", color: "#3178C6", stars: 14 },
  { name: "E-Commerce", lang: "TypeScript", color: "#3178C6", stars: 8 },
  { name: "3D Configurator", lang: "Three.js", color: "#0495E0", stars: 11 },
  { name: "AI Dashboard", lang: "Python", color: "#3572A5", stars: 6 },
];

// ─── Mouse tracker hook ────────────────────────────────────────────────
function useMouseRelative() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState(false);
  const onMove = useCallback((e: React.MouseEvent, el: HTMLElement | null) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);
  return { pos, hovered, setHovered, onMove };
}

// ─── BentCard ──────────────────────────────────────────────────────────
function BentCard({
  className = "", children, label, glass = false,
}: { className?: string; children: React.ReactNode; label?: string; glass?: boolean }) {
  void glass; // reserved for future glass-morphism variants; visual effect currently driven by className
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { pos, hovered, setHovered, onMove } = useMouseRelative();
  const magnetTarget = useRef({ x: 0, y: 0 });
  const magnetCur = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || REDUCED_MOTION) return;
    const tick = () => {
      const mc = magnetCur.current, mt = magnetTarget.current;
      mc.x += (mt.x - mc.x) * 0.12;
      mc.y += (mt.y - mc.y) * 0.12;
      const tx = hovered ? (pos.y - 0.5) * -4 : 0;
      const ty = hovered ? (pos.x - 0.5) * 4 : 0;
      const ly = hovered ? -3 : 0;
      inner.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg) translateY(${ly + mc.y * 0.3}px) translateX(${mc.x * 0.3}px)`;
      inner.style.boxShadow = hovered ? "0 20px 60px rgba(0,0,0,0.35)" : "0 4px 20px rgba(0,0,0,0.15)";
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [hovered, pos]);

  const onMoveCard = useCallback((e: React.MouseEvent) => {
    onMove(e, cardRef.current);
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.sqrt(dx * dx + dy * dy);
    const maxD = Math.max(r.width, r.height) * 0.6;
    const s = Math.max(0, 1 - d / maxD);
    const p = s * s * 12;
    magnetTarget.current = { x: (dx / (d || 1)) * p, y: (dy / (d || 1)) * p };
  }, [onMove]);

  const onLeave = useCallback(() => { setHovered(false); magnetTarget.current = { x: 0, y: 0 }; }, [setHovered]);
  const gx = pos.x * 100, gy = pos.y * 100;

  return (
    <div ref={cardRef} onMouseMove={onMoveCard} onMouseEnter={() => setHovered(true)} onMouseLeave={onLeave}
      className={`group relative rounded-[28px] overflow-hidden border will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{ background: `radial-gradient(500px circle at ${gx}% ${gy}%, rgba(239,68,68,0.08), transparent 50%)` }} />
      <div className="absolute inset-0 rounded-[28px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{ padding: "1px",

          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
      <div ref={innerRef} className="relative z-10 h-full w-full p-6 md:p-8 flex flex-col" style={{ transition: "box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        {label && <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EF4444]/60 mb-auto self-start shrink-0">{label}</span>}
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CARD 1 — Hero About (smooth fade-up + float idle)
// ════════════════════════════════════════════════════════════════════════
function HeroAboutCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Entrance: smooth block fade-up ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const blocks = el.querySelectorAll<HTMLElement>(".h-block");
    const status = el.querySelector<HTMLElement>(".h-status");
    const ctx = gsap.context(() => {
      gsap.set(blocks, { y: 24, opacity: 0 });
      if (status) gsap.set(status, { opacity: 0 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 80%", toggleActions: "play none none reverse" });
      gsap.to(blocks, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out", scrollTrigger: st });
      if (status) gsap.to(status, { opacity: 1, duration: 0.5, delay: 0.6, ease: "power2.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0 });
    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div ref={cardRef}>
      <BentCard className="bg-[#141414] border-white/[0.06]" label="ABOUT_ME.TXT">
        <div className="flex flex-col justify-center h-full">
          <h3 className="h-block font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-white mt-12">
            {[
              { t: "I build products that", h: false },
              { t: "feel fast", h: true },
              { t: ",", h: false },
              { t: "look premium", h: true },
              { t: ",", h: false },
              { t: "and", h: false },
              { t: "solve real problems", h: true },
              { t: ".", h: false },
            ].map((w, i) => (
              <span key={i} className="inline-block" style={{ whiteSpace: w.t === "," ? "inline" : undefined }}>
                <span className={w.h ? "text-[#EF4444]" : "text-white"}>{w.t}</span>
                {w.t === "," ? "" : " "}
              </span>
            ))}
          </h3>
          <div className="h-block">
            <p className="text-white/50 text-sm md:text-base leading-relaxed mt-6 max-w-xl font-sans font-light">
              <span className="block">Frontend developer focused on React, Next.js, TypeScript, Three.js</span>
              <span className="block mt-1">and modern UI engineering. I enjoy building products that are <span className="text-white/70">fast</span>, <span className="text-white/70">beautiful</span> and <span className="text-white/70">memorable</span>.</span>
            </p>
          </div>
          <div className="h-status flex items-center gap-2 mt-auto pt-8">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" /></span>
            <span className="text-[11px] font-mono text-white/40 tracking-wide uppercase">Available for freelance</span>
          </div>
        </div>
      </BentCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CARD 2 — Metrics (smooth fade-up + shimmer idle)
// ════════════════════════════════════════════════════════════════════════
function StatsCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Entrance: smooth fade-up stagger ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const items = el.querySelectorAll<HTMLElement>(".stat-item");
    const ctx = gsap.context(() => {
      gsap.set(items, { y: 16, opacity: 0 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 85%", toggleActions: "play none none reverse" });
      gsap.to(items, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.8 });
    return () => gsap.killTweensOf(el);
  }, []);

  // ── Idle: number shimmer ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const nums = el.querySelectorAll<HTMLElement>(".stat-num");
    nums.forEach((n) => {
      gsap.to(n, { opacity: 0.7, duration: 1.2 + Math.random() * 0.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 2 });
    });
    return () => nums.forEach((n) => gsap.killTweensOf(n));
  }, []);

  return (
    <div ref={cardRef}>
      <BentCard className="bg-black/40 backdrop-blur-xl border-white/[0.04]" label="METRICS" glass>
        <div className="grid grid-cols-2 gap-0 mt-8 flex-1 content-center h-full">
          {STATS.map((s, i) => (
            <div key={s.label} className="relative flex flex-col items-center justify-center py-4 stat-item">
              <span className="stat-num text-3xl md:text-4xl font-display font-bold tracking-tight text-white tabular-nums">
                <CounterDisplay value={s.value} suffix={s.suffix} delay={i * 0.15} />
              </span>
              <span className="stat-label text-[11px] font-mono text-white/40 tracking-wide uppercase mt-1">{s.label}</span>
              {i < 3 && <span className="stat-divider absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/10 origin-left" />}
            </div>
          ))}
        </div>
      </BentCard>
    </div>
  );
}

function CounterDisplay({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) { setDisplay(value); return; }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true, onEnter: () => {
          if (done.current) return;
          done.current = true;
          gsap.fromTo({ val: Math.round(value * 0.1) }, { val: Math.round(value * 0.1) }, { val: value, duration: 1.8 + delay, ease: "power2.out", delay, onUpdate: function () { setDisplay(Math.round(this.targets()[0].val)); } });
        },
      });
    });
    return () => ctx.revert();
  }, [value, delay]);
  return <span ref={ref}>{display}{suffix}</span>;
}

// ════════════════════════════════════════════════════════════════════════
// CARD 3 — Skills (clean cascade entrance + refined hover)
// ════════════════════════════════════════════════════════════════════════
function SkillsCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);

  // ── Entrance: logos cascade in with gentle scale+fade ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const logos = el.querySelectorAll<HTMLElement>(".skill-logo");
    const ctx = gsap.context(() => {
      gsap.set(logos, { y: 12, opacity: 0, scale: 0.9 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 80%", toggleActions: "play none none reverse" });
      gsap.to(logos, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.03, ease: "power2.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });
    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div ref={cardRef}>
      <BentCard className="bg-[#F8F8F8] border-black/[0.06]" label="EXPERTISE">
        <div className="grid grid-cols-8   gap-2 mt-4 flex-1 content-start">
          {TECH_LOGOS.map((s) => (
            <div key={s.name}
              onMouseEnter={() => setHoveredLogo(s.name)} onMouseLeave={() => setHoveredLogo(null)}
              className="skill-logo relative flex items-center justify-center select-none transition-all duration-200 overflow-hidden rounded-lg"

            >
              <img
                src={s.img}
                alt={s.name}
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  filter: hoveredLogo === s.name ? "brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.2))" : "grayscale(0.2) brightness(0.9)",
                  transition: "filter 0.2s ease",
                }}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          ))}
        </div>
      </BentCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CARD 4 — Education Timeline (clean fade-up stagger)
// ════════════════════════════════════════════════════════════════════════
function EducationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // ── Entrance: items fade up + timeline fades in ──
  useEffect(() => {
    const el = cardRef.current;
    const line = lineRef.current;
    if (!el || !line || REDUCED_MOTION) return;
    const items = el.querySelectorAll<HTMLElement>(".edu-item");
    const courses = el.querySelectorAll<HTMLElement>(".edu-course");
    const ctx = gsap.context(() => {
      gsap.set(line, { opacity: 0 });
      gsap.set(items, { y: 12, opacity: 0 });
      gsap.set(courses, { y: 6, opacity: 0 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 80%", toggleActions: "play none none reverse" });
      gsap.to(line, { opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: st });
      gsap.to(items, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", scrollTrigger: st });
      gsap.to(courses, { y: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: "power2.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2 });
    return () => gsap.killTweensOf(el);
  }, []);

  const courses = ["Web Development", "Operating Systems", "DBMS", "Computer Networks"];

  return (
    <div ref={cardRef}>
      <BentCard className="bg-[#0D0D0D] border-white/[0.04]" label="EDUCATION">
        <div className="flex gap-4 mt-6 flex-1">
          <div className="relative w-[2px] flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <div ref={lineRef} className="absolute top-0 left-0 w-full bg-[#EF4444] rounded-full" style={{ height: "100%", transformOrigin: "top center" }} />
            <div className="absolute w-3 h-3 -left-[5px] rounded-full bg-[#EF4444] border-2 border-[#0D0D0D]" style={{ top: "4px" }} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="edu-item"><h4 className="text-white text-sm font-display font-bold leading-snug">Bachelor of Computer Science</h4></div>
            <div className="edu-item"><p className="text-white/40 text-[11px] font-mono">XYZ University</p></div>
            <div className="edu-item"><p className="text-white/30 text-[11px] font-mono">2022 — 2026</p></div>
            <div className="edu-item"><p className="text-white/50 text-[11px] font-mono mt-1">CGPA: <span className="text-[#EF4444] font-medium">3.8 / 4.0</span></p></div>
            <div className="mt-2">
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.15em] mb-2">Relevant Coursework</p>
              <div className="flex flex-wrap gap-1.5">
                {courses.map((c) => (<span key={c} className="edu-course px-2 py-0.5 rounded text-[10px] font-mono text-white/50 bg-white/5">{c}</span>))}
              </div>
            </div>
          </div>
        </div>
      </BentCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CARD 5 — GitHub (authentic GitHub profile layout)
// ════════════════════════════════════════════════════════════════════════
const GH_CONTRIBS = Array.from({ length: 49 }, () =>
  Math.random() < 0.4 ? 0 : Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 2 : 3
);

function GitHubCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Entrance: sections fade in ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const sections = el.querySelectorAll<HTMLElement>(".gh-sec");
    const ctx = gsap.context(() => {
      gsap.set(sections, { y: 14, opacity: 0 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 82%", toggleActions: "play none none reverse" });
      gsap.to(sections, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.4 });
    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div ref={cardRef}>
      <BentCard className="bg-[#0D1117] border-white/[0.06]" label="GITHUB">
        <div className="flex flex-col gap-3 mt-4 flex-1">
          {/* ── Profile header ── */}
          <div className="gh-sec flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[13px] font-semibold leading-tight">heysayeed</span>
              <span className="text-white/30 text-[10px] font-mono">Joined 2024</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-center">
                <span className="text-white text-[13px] font-display font-bold tabular-nums">120</span>
                <p className="text-white/30 text-[8px] font-mono uppercase tracking-wider">Repos</p>
              </div>
              <div className="text-center">
                <span className="text-white text-[13px] font-display font-bold tabular-nums">42</span>
                <p className="text-white/30 text-[8px] font-mono uppercase tracking-wider">Stars</p>
              </div>
            </div>
          </div>

          {/* ── Contribution graph ── */}
          <div className="gh-sec">
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: 7 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-0.5">
                  {Array.from({ length: 7 }).map((_, row) => {
                    const level = GH_CONTRIBS[row * 7 + col];
                    const opacity = level === 0 ? 0.15 : level === 1 ? 0.4 : level === 2 ? 0.65 : 0.9;
                    return (
                      <div key={row}
                        className="rounded-[2px]"
                        style={{
                          width: 8,
                          height: 8,
                          background: level === 0 ? "rgba(255,255,255,0.06)" : `rgba(239,68,68,${opacity})`,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">547 contributions this year</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[8px] font-mono text-white/20">Less</span>
                <div className="w-2 h-2 rounded-[2px] bg-white/[0.06]" />
                <div className="w-2 h-2 rounded-[2px]" style={{ background: "rgba(239,68,68,0.4)" }} />
                <div className="w-2 h-2 rounded-[2px]" style={{ background: "rgba(239,68,68,0.65)" }} />
                <div className="w-2 h-2 rounded-[2px]" style={{ background: "rgba(239,68,68,0.9)" }} />
                <span className="text-[8px] font-mono text-white/20">More</span>
              </div>
            </div>
          </div>

          {/* ── Pinned repos ── */}
          <div className="gh-sec">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.15em]">Pinned</span>
            <div className="flex flex-col gap-1.5 mt-1.5">
              {PINNED_REPOS.slice(0, 2).map((r) => (
                <div key={r.name}
                  className="gh-repo group/repo flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-200 hover:bg-white/[0.06] hover:-translate-y-0.5"
                >
                  <svg className="text-white/30 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                  </svg>
                  <span className="text-[11px] font-mono text-[#58A6FF] group-hover/repo:text-[#58A6FF]/80 truncate">{r.name}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-[9px] font-mono text-white/30">{r.lang}</span>
                    <span className="flex items-center gap-0.5 text-white/30">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="text-[9px] font-mono">{r.stars}</span>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BentCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// CARD 6 — Expertise (premium numbered badges)
// ════════════════════════════════════════════════════════════════════════
function ExpertiseCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Entrance: items fade in with gentle scale ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    const items = el.querySelectorAll<HTMLElement>(".exp-item");
    const ctx = gsap.context(() => {
      gsap.set(items, { y: 12, opacity: 0, scale: 0.95 });
      const st = ScrollTrigger.create({ trigger: el, start: "top 80%", toggleActions: "play none none reverse" });
      gsap.to(items, { y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, ease: "power3.out", scrollTrigger: st });
    });
    return () => ctx.revert();
  }, []);

  // ── Idle: barely-noticeable 1px float ──
  useEffect(() => {
    const el = cardRef.current;
    if (!el || REDUCED_MOTION) return;
    gsap.to(el, { y: -1, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });
    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div ref={cardRef}>
      <BentCard className="bg-[#141414] border-white/[0.06]" label="EXPERTISE">
        <div className="grid grid-cols-2 gap-2.5 mt-5 flex-1 content-start">
          {EXPERTISE.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div key={item.label}
                className="exp-item group/exp relative flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] transition-all duration-300 hover:bg-[#EF4444] hover:border-[#EF4444] hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#EF4444]/20"
              >
                <span className="text-[9px] font-mono font-bold text-[#EF4444]/60 group-hover/exp:text-white/60 transition-colors duration-300">{num}</span>
                <span className="text-[12px] font-mono font-medium text-white/70 group-hover/exp:text-white transition-colors duration-300 leading-tight">{item.label}</span>
              </div>
            );
          })}
        </div>
      </BentCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Background Layers
// ════════════════════════════════════════════════════════════════════════
function NoiseOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.025, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />
  );
}

function FloatingGrid() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let f: number, o = 0;
    const fn = () => { o += 0.03; el!.style.backgroundPosition = `${o}px ${o * 0.7}px`; f = requestAnimationFrame(fn); };
    f = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(f);
  }, []);
  return <div ref={ref} className="absolute inset-0 pointer-events-none z-[1]"
    style={{ backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.06) 0.5px, transparent 0.5px)", backgroundSize: "40px 40px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 70%)" }} />;
}

function FloatingParticles() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED_MOTION) return;
    const dots = el.querySelectorAll<HTMLElement>(".fp-dot");
    dots.forEach((d) => {
      gsap.to(d, { y: -(30 + Math.random() * 50), opacity: 0, duration: 4 + Math.random() * 4, ease: "none", repeat: -1, delay: Math.random() * 5 });
    });
    return () => dots.forEach((d) => gsap.killTweensOf(d));
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="fp-dot absolute w-[2px] h-[2px] rounded-full bg-[#EF4444]/20"
          style={{ left: `${Math.random() * 100}%`, top: `${40 + Math.random() * 60}%` }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ════════════════════════════════════════════════════════════════════════
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  // ── Section entrance: container fade + handwritten text draws ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION) return;
    gsap.set(section, { opacity: 0 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section, start: "top 90%", toggleActions: "play none none none",
        onEnter: () => { gsap.to(section, { opacity: 1, duration: 0.4, ease: "power2.out" }); },
      });
    });
    return () => ctx.revert();
  }, []);

  // ── Mouse parallax ──
  useEffect(() => {
    if (REDUCED_MOTION) return;
    const s = sectionRef.current;
    if (!s) return;
    const onMouse = (e: MouseEvent) => {
      s.style.setProperty("--px", `${((e.clientX / innerWidth - 0.5) * 2) * 10}px`);
      s.style.setProperty("--py", `${((e.clientY / innerHeight - 0.5) * 2) * 10}px`);
    };
    addEventListener("mousemove", onMouse, { passive: true });
    return () => removeEventListener("mousemove", onMouse);
  }, []);

  return (
    <section id="about" ref={sectionRef}
      className="relative z-10 py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0A0A0A]"
      >
      <FloatingGrid />
      <NoiseOverlay />
      <FloatingParticles />


      {/* Section header */}
      <div ref={headlineRef} className="max-w-7xl mx-auto mb-12 md:mb-16 relative z-10">
        <div className="mb-4"><HandwritingText /></div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white/10 mt-2 tracking-[-0.02em] select-none uppercase">
          Behind the Code
        </h2>
      </div>

      {/* Bento grid — matches user's ASCII layout exactly:
        ┌────────────────────┬────────────────────┐
        │                    │     CARD 3         │
        │     CARD 1         ├────────────────────┤
        │     (tall)         │     CARD 4         │
        ├──────────┬─────────┴────────┬───────────┤
        │ CARD 5   │     CARD 2       │  CARD 6   │
        └──────────┴──────────────────┴───────────┘
      */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-5 lg:gap-6 auto-rows-[240px] md:auto-rows-[260px] lg:auto-rows-[280px]">
          {/* Row 1-2: Tall left */}
          <div className="col-span-1 md:col-span-4 lg:col-span-7 md:row-span-2"><HeroAboutCard /></div>
          {/* Row 1: Top right */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5"><SkillsCard /></div>
          {/* Row 2: Bottom right (under Skills) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5"><EducationCard /></div>
          {/* Row 3: Three equal columns */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4"><GitHubCard /></div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4"><StatsCard /></div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4"><ExpertiseCard /></div>
        </div>
      </div>
    </section>
  );
}