import { useEffect, useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const ACCENT = "#EF4444";
const ORANGE = "#FF5A1F";

// ─── Project Data ─────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, name: "Nova Commerce",
    tagline: "Headless E-Commerce Platform",
    desc: "A blazing-fast headless commerce platform built with Next.js and Stripe. Real-time inventory, AI recommendations, and seamless checkout.",
    tech: ["Next.js", "TypeScript", "Stripe", "Prisma"],
    year: "2025", role: "Full-Stack Lead",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  },
  {
    id: 2, name: "Sentinel AI",
    tagline: "Real-Time Analytics Dashboard",
    desc: "Intelligent monitoring dashboard with real-time data visualization, anomaly detection, and predictive analytics for engineering teams.",
    tech: ["React", "Three.js", "WebSockets", "D3"],
    year: "2025", role: "Frontend Architect",
    gradient: "from-[#0d0d0d] via-[#1a1a2e] to-[#2d2d44]",
  },
  {
    id: 3, name: "Vertex Configurator",
    tagline: "3D Product Customizer",
    desc: "Real-time 3D product configurator for customizing colors, materials, and components. Built with React Three Fiber for buttery-smooth interactions.",
    tech: ["Three.js", "React Three Fiber", "R3F Drei", "GSAP"],
    year: "2024", role: "3D Engineer",
    gradient: "from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]",
  },
  {
    id: 4, name: "Lucid Design System",
    tagline: "Component Library & Design Tokens",
    desc: "Production-grade design system powering 12+ products. 80+ components, accessibility-first architecture, and Storybook documentation.",
    tech: ["React", "TypeScript", "Tailwind", "Storybook"],
    year: "2024", role: "Design Systems Lead",
    gradient: "from-[#1c1c1e] via-[#2c2c2e] to-[#3a3a3c]",
  },
  {
    id: 5, name: "Moment Studio",
    tagline: "Creative Portfolio Platform",
    desc: "Visual storytelling platform for creative professionals. Combines a powerful CMS with stunning animation capabilities.",
    tech: ["Next.js", "Framer Motion", "GSAP"],
    year: "2024", role: "Creative Developer",
    gradient: "from-[#0b0b0d] via-[#1d1d20] to-[#2d2d30]",
  },
  {
    id: 6, name: "Pulse Analytics",
    tagline: "Performance Monitoring Suite",
    desc: "Comprehensive performance monitoring tool tracking Core Web Vitals, bundle sizes, and runtime performance.",
    tech: ["React", "TypeScript", "Web Workers"],
    year: "2023", role: "Solo Developer",
    gradient: "from-[#0a0a0f] via-[#1a1a2e] to-[#2a0a0a]",
  },
];

// ─── Handwriting SVG ──────────────────────────────────────────
function HandwritingSVG() {
  const textRef = useRef<SVGTextElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el || REDUCED_MOTION) { setDrawn(true); return; }
    let killed = false;
    const STROKE_LEN = 2000;
    el.setAttribute("stroke", ORANGE);
    el.setAttribute("stroke-width", "2");
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    el.setAttribute("stroke-dasharray", `${STROKE_LEN}`);
    el.setAttribute("stroke-dashoffset", `${STROKE_LEN}`);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el.closest("[data-hw-trigger]"),
        start: "top 85%", toggleActions: "play none none none", once: true,
        onEnter: () => {
          const tl = gsap.timeline({ onComplete: () => {
            if (killed) return;
            setDrawn(true);
            gsap.to(el, { attr: { fill: ORANGE }, duration: 0.4, ease: "power2.out",
              onComplete: () => { el.style.stroke = "none"; el.removeAttribute("stroke"); el.removeAttribute("stroke-dasharray"); el.removeAttribute("stroke-dashoffset"); },
            });
          }});
          tl.to(el, { strokeDashoffset: 0, duration: 2.4, ease: "cubic-bezier(0.0, 0.0, 0.3, 1.0)" });
        },
      });
    });
    return () => { killed = true; ctx.revert(); };
  }, []);

  return (
    <svg className="h-auto overflow-visible select-none" style={{ width: "clamp(180px, 35vw, 340px)", maxWidth: "100%" }} viewBox="0 0 400 70" xmlns="http://www.w3.org/2000/svg">
      <text ref={textRef} x="50%" y="48" textAnchor="middle" fontFamily="Caveat" fontSize="38" fontWeight="500" fill="none" style={{ willChange: "stroke-dashoffset" }}>selected work</text>
      {drawn && <text x="50%" y="48" textAnchor="middle" fontFamily="Caveat" fontSize="38" fontWeight="500" fill={ORANGE}>selected work</text>}
    </svg>
  );
}

// ─── Cream Sticky Note ────────────────────────────────────────
function StickyNote() {
  return (
    <div className="relative inline-block mt-8 md:mt-10 select-none" style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.25))" }}>
      <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-14 h-7 z-10 rotate-[-1.5deg]"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 100%)",
          clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          opacity: 0.7,
        }}
      />
      <div className="relative px-7 py-5 rounded-[10px]"
        style={{
          background: "#F5F0E8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <div className="absolute inset-0 rounded-[10px] pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat", backgroundSize: "128px 128px",
          }}
        />
        <div className="absolute -bottom-[1px] -right-[1px] w-7 h-7 rounded-br-[10px]"
          style={{ background: "linear-gradient(225deg, rgba(0,0,0,0.12) 0%, transparent 50%)" }}
        />
        <p className="relative text-sm md:text-[15px] font-sans leading-relaxed tracking-[-0.01em]"
          style={{ color: "rgba(40,40,40,0.7)", fontWeight: 400 }}
        >
          Six projects.<br />
          Scroll down to explore my best work.
        </p>
      </div>
    </div>
  );
}

// ─── Background Layer ────────────────────────────────────────
function WorksBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gridRef.current; if (!el) return;
    let f: number, o = 0;
    const fn = () => { o += 0.02; el!.style.backgroundPosition = `${o}px ${o * 0.7}px`; f = requestAnimationFrame(fn); };
    f = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(f);
  }, []);

  return (
    <>
      <div ref={gridRef} className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(239,68,68,0.04) 0.5px, transparent 0.5px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 35%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 35%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025]"
        style={{
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "256px 256px",
          animation: "noise-shift 0.5s steps(5) infinite",
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.03) 0%, transparent 60%)" }}
      />
    </>
  );
}

// ─── Project Panel ────────────────────────────────────────────
function ProjectPanel({
  project, index, panelRef
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  panelRef: (el: HTMLDivElement | null) => void;
}) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mp, setMp] = useState({ x: 0.5, y: 0.5 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setMp({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  return (
    <div ref={panelRef} className="project-panel shrink-0 relative flex items-center justify-center"
      style={{ width: "min(92vw, 1360px)", marginRight: "60px", perspective: "1200px" }}
      data-project={project.id}
    >
      <div className="relative w-full h-full flex items-center gap-10 lg:gap-14">
        {/* Project number badge at top of card */}
        <div className="absolute top-2 left-0 z-30 select-none">
          <span className="font-mono text-[13px] font-bold tracking-[0.15em]" style={{ color: ACCENT }}>
            {String(project.id).padStart(2, "0")}
          </span>
        </div>
        <div ref={imageRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setMp({ x: 0.5, y: 0.5 }); }}
          className="project-image relative w-[58%] h-[75vh] rounded-[20px] overflow-hidden border border-white/[0.06]  cursor-none shrink-0"
          style={{
            transform: hovered
              ? `perspective(800px) rotateX(${(mp.y - 0.5) * -5}deg) rotateY(${(mp.x - 0.5) * 5}deg) scale3d(1.015, 1.015, 1.015)`
              : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
            transition: hovered ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
          <div className="absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-300"
            style={{ opacity: hovered ? 0.12 : 0, background: `radial-gradient(circle at ${mp.x*100}% ${mp.y*100}%, rgba(255,255,255,0.35), transparent 60%)` }}
          />
          <div className="absolute bottom-5 right-5 font-display font-bold select-none"
            style={{ fontSize: "clamp(2.5rem,6vw,6rem)", color: "rgba(255,255,255,0.03)", lineHeight: 1 }}
          >
            {String(project.id).padStart(2,"0")}
          </div>
          <div className="absolute bottom-5 left-5 z-10">
            <p className="text-white/25 text-[9px] font-mono uppercase tracking-[0.15em] mb-1">{project.tagline}</p>
            <h3 className="text-white text-lg md:text-xl font-display font-bold tracking-[-0.02em]">{project.name}</h3>
          </div>
        </div>

        <div className="project-content flex flex-col justify-center w-[38%] shrink-0">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] mb-3" style={{ color: ACCENT }}>PROJECT {String(project.id).padStart(2,"0")}</span>
          <h2 className="project-title text-2xl md:text-3xl font-display font-bold text-white leading-[1.15] tracking-[-0.02em] mb-3">{project.name}</h2>
          <p className="project-desc text-white/35 text-sm font-sans font-light leading-relaxed mb-5 max-w-sm">{project.desc}</p>
          <div className="project-tech flex flex-wrap gap-1.5 mb-5">
            {project.tech.map((t) => (
              <span key={t} className="px-2.5 py-1 text-[9px] font-mono rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40">{t}</span>
            ))}
          </div>
          <div className="project-year text-white/20 text-[10px] font-mono uppercase tracking-[0.12em] mb-4">{project.year} · {project.role}</div>
          <div className="project-btns flex items-center gap-2.5">
            <a href="#" onClick={(e) => e.preventDefault()}
              className="group relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-sans font-light text-white bg-[#EF4444] overflow-hidden hover:shadow-lg hover:shadow-[#EF4444]/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Visit Website</span>
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}
              className="group flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-sans font-light text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT — Two-phase pinned scroll
// ═══════════════════════════════════════════════════════════════
export default function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(true);

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setPanelRef = (i: number) => (el: HTMLDivElement | null) => { panelRefs.current[i] = el; };

  // ─── Entrance: intro content fade-in ────────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el || REDUCED_MOTION) return;
    const children = el.querySelectorAll<HTMLElement>(".ws-el");
    gsap.set(children, { y: 16, opacity: 0 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el, start: "top 85%", toggleActions: "play none none none", once: true,
        onEnter: () => { gsap.to(children, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power3.out" }); },
      });
    });
    return () => ctx.revert();
  }, []);

  // ─── Two-phase pinned scroll setup ──────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    const track = trackRef.current;
    const content = contentRef.current;
    if (!section || !stack || !track || !content || REDUCED_MOTION) return;

    const introHeight = content.offsetHeight;
    const scrollDistance = Math.max(0, track.scrollWidth - window.innerWidth);
    if (scrollDistance <= 0 && introHeight <= 0) return;

    // Intro phase gets equal proportion — no extra pause between
    // phases. Gallery starts right after intro exits, AboutSection
    // appears immediately after the 6th card.
    const INTRO_SCALE = 1;
    const scaledIntro = introHeight * INTRO_SCALE;
    const totalDist = scaledIntro + scrollDistance;
    const vh = window.innerHeight;

    // Set section height to match the exact scroll distance needed
    section.style.height = totalDist + "px";

    // ── Single timeline with two phases ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalDist}`,
        pin: true,
        pinSpacing: false,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress; // 0 → 1 over totalDist

          // Phase 1: 0 → scaledIntro/totalDist (intro scrolls up)
          // Phase 2: scaledIntro/totalDist → 1 (gallery scrolls horizontally)
          const phaseTwoStart = scaledIntro / totalDist;

          // Horizontal progress (0 during phase 1, 0→1 during phase 2)
          const hProgress = progress <= phaseTwoStart
            ? 0
            : (progress - phaseTwoStart) / (1 - phaseTwoStart);

          // Update progress line
          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${hProgress * 100}%`;
          }

          // Trigger project entrance animations (only during phase 2)
          panelRefs.current.forEach((panel, i) => {
            if (!panel || panel.dataset.entered === "true") return;
            const threshold = i / (PROJECTS.length - 1 || 1);
            if (hProgress >= threshold - 0.08) {
              panel.dataset.entered = "true";
              triggerEntrance(panel, i);
            }
          });
        },
      },
    });

    // Phase 1: scroll the content stack UP (intro content moves out of view)
    // Uses scaledIntro as the scroll proportion so the intro has breathing room
    const totalUnits = scaledIntro + scrollDistance;
    tl.to(stack, { y: -introHeight, ease: "none", duration: scaledIntro / totalUnits });
    // Phase 2: slide the gallery track LEFT (horizontal scroll through projects)
    tl.to(track, { x: -scrollDistance, ease: "none", duration: scrollDistance / totalUnits }, ">");

    return () => {
      tl.kill();
      section.style.height = "";
    };
  }, []);

  // ─── Per-project entrance animation ──────────────────────
  const triggerEntrance = useCallback((panel: HTMLDivElement, index: number) => {
    const image = panel.querySelector<HTMLElement>(".project-image");
    const content = panel.querySelector<HTMLElement>(".project-content");
    if (!image || !content) return;

    const title = content.querySelector<HTMLElement>(".project-title");
    const desc = content.querySelector<HTMLElement>(".project-desc");
    const tech = content.querySelector<HTMLElement>(".project-tech");
    const year = content.querySelector<HTMLElement>(".project-year");
    const btns = content.querySelector<HTMLElement>(".project-btns");

    gsap.set(image, { x: 40, opacity: 0, scale: 0.95 });
    if (title) gsap.set(title, { y: 20, opacity: 0 });
    if (desc) gsap.set(desc, { y: 12, opacity: 0 });
    if (tech) gsap.set(tech, { y: 10, opacity: 0 });
    if (year) gsap.set(year, { y: 8, opacity: 0 });
    if (btns) gsap.set(btns, { y: 10, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Image first (unique reveal)
    if (index === 0) {
      gsap.set(image, { clipPath: "inset(0 100% 0 0)" });
      tl.to(image, { clipPath: "inset(0 0% 0 0)", x: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power4.out" });
    } else if (index === 2) {
      gsap.set(image, { scale: 0.8, opacity: 0 });
      tl.to(image, { scale: 1, opacity: 1, x: 0, duration: 0.6 });
    } else if (index === 4) {
      gsap.set(image, { y: 60, opacity: 0 });
      tl.to(image, { y: 0, opacity: 1, x: 0, scale: 1, duration: 0.6 });
    } else {
      tl.to(image, { x: 0, opacity: 1, scale: 1, duration: 0.5 });
    }

    // Then content in sequence: title → desc → tech → year → buttons
    const seq = [title, desc, tech, year, btns].filter(Boolean) as HTMLElement[];
    tl.to(seq, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4 }, "-=0.15");
  }, []);

  // ─── Scroll hint ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 100) setShowHint(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} id="work" className="relative z-20 bg-transparent">
      {/* ─── Pinned container: both intro content + gallery inside ── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden" style={{ zIndex: 1 }}>
i         <WorksBackground />

        {/* Top progress line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.04] z-20">
          <div ref={progressLineRef} className="h-full bg-[#EF4444]" style={{ width: "0%", boxShadow: "0 0 8px rgba(239,68,68,0.3)" }} />
        </div>

        {/* ─── Content stack: vertical + horizontal phases ──── */}
        <div ref={stackRef} className="relative w-full" style={{ height: "200vh", willChange: "transform" }}>
          {/* Phase 1 viewport: intro content (fills first 100vh of stack) */}
          <div ref={contentRef} className="h-screen flex flex-col items-center justify-center px-6" data-hw-trigger>
            <div className="flex flex-col items-center text-center max-w-3xl">
              <div className="ws-el"><HandwritingSVG /></div>
              <h1 className="ws-el font-display font-bold text-white leading-[0.88] tracking-[-0.04em] mt-1 select-none">
                <span style={{ fontSize: "clamp(2rem, 10vw, 7rem)" }}>WHAT I</span>
                <br />
                <span className="block" style={{ fontSize: "clamp(3rem, 14vw, 9rem)", color: ACCENT }}>BUILD</span>
              </h1>
              <div className="ws-el"><StickyNote /></div>
            </div>
          </div>

          {/* Phase 2 viewport: gallery track (fills second 100vh of stack) */}
          <div ref={trackRef} className="flex items-center h-screen"
            style={{ paddingLeft: "max(5vw, 40px)", willChange: "transform" }}
          >
            {PROJECTS.map((proj, i) => (
              <ProjectPanel key={proj.id} project={proj} index={i} panelRef={setPanelRef(i)} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {showHint && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
            style={{ animation: "ws-hint-float 2.5s ease-in-out infinite" }}
          >
            <span className="text-[8px] font-sans font-light uppercase tracking-[0.25em] text-white/15">Scroll to explore</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
              style={{ animation: "ws-hint-arrow 2.5s ease-in-out infinite" }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
