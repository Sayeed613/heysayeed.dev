import { useEffect, useRef } from "react";
import gsap from "gsap";
import ChromeBar from "./components/ChromeBar";
import FloatingNav from "./components/FloatingNav";
import DragChip from "./components/DragChip";

const HEADLINE_TEXT = "Ship fast. Break nothing.";

const HEADLINE_WORDS = HEADLINE_TEXT.split(" ");

function HeadlineWords({ showCursor }: { showCursor: boolean }) {
  return (
    <>
      {HEADLINE_WORDS.map((word, i) => (
        <span key={i} className="hero-word inline-block">
          {word}
          {i < HEADLINE_WORDS.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
      {showCursor && (
        <span className="hero-cursor inline-block text-accent ml-0.5 font-mono font-light">
          |
        </span>
      )}
    </>
  );
}

function App() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const noiseOverlayRef = useRef<HTMLHeadingElement>(null);
  const headlineContainerRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaPrimaryRef = useRef<HTMLAnchorElement>(null);
  const ctaSecondaryRef = useRef<HTMLAnchorElement>(null);
  const cornerLeftRef = useRef<HTMLDivElement>(null);
  const cornerRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // 1. Chrome bar — slide down
    tl.from("#chrome-bar", { y: -20, opacity: 0, duration: 0.5 });

    // 2. Floating nav — slide down, slightly overlapping step 1
    tl.from("#floating-nav", { y: -15, opacity: 0, duration: 0.5 }, "-=0.35");

    // 3. Badge pill — slide up, overlapping step 2
    tl.from(badgeRef.current, { y: 10, opacity: 0, duration: 0.4 }, "-=0.2");

    // 4. Headline words — staggered slide up
    const wordSpans = headlineRef.current?.querySelectorAll(".hero-word");
    if (wordSpans?.length) {
      tl.from(
        wordSpans,
        { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 },
        "-=0.15",
      );
    }

    // Cursor activates after headline finishes (class-based, avoids inline-style conflict)
    tl.call(
      () => {
        document.querySelector(".hero-cursor")?.classList.add("active");
      },
      [],
      ">",
    );

    // 5. Subtext — slide up after headline finishes
    tl.from(subtextRef.current, { y: 15, opacity: 0, duration: 0.5 }, ">");

    // 6. CTAs — scale in, staggered, right after subtext
    tl.from(
      [ctaPrimaryRef.current, ctaSecondaryRef.current],
      { scale: 0.95, opacity: 0, duration: 0.4, stagger: 0.1 },
      ">",
    );

    // 7. Corner copy — fade in last, after CTAs finish
    tl.from(
      [cornerLeftRef.current, cornerRightRef.current],
      { opacity: 0, duration: 0.4 },
      ">",
    );

    return () => {
      tl.kill();
    };
  }, []);

  // ─── Headline hover-noise effect ──────────────────────
  useEffect(() => {
    // Disable on touch devices or small viewports
    const isTouchOrSmall =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;

    const overlay = noiseOverlayRef.current;
    const container = headlineContainerRef.current;
    if (isTouchOrSmall || !overlay || !container) return;

    // Start hidden
    gsap.set(overlay, { opacity: 0 });

    const tween = gsap.to(overlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      paused: true,
      overwrite: "auto",
    });

    const onEnter = () => tween.play();
    const onLeave = () => tween.reverse();

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      tween.kill();
    };
  }, []);

  return (
    <>
      <ChromeBar />
      <FloatingNav />

      {/* ─── Hero Background Layer ─── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* ─── Hero Section ─── */}
      <section
        id="home"
        className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-svh px-6 pt-[88px] pb-16"
      >
        <div className="max-w-3xl w-full text-center">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-editor-surface text-text-muted text-[11px] font-mono tracking-wide mb-6"
          >
            building in public — 2026
          </div>

          {/* ─── Headline with hover-noise effect ──────── */}
          {/** SVG filter: feTurbulence → feColorMatrix → feComposite creates a dot-matrix pattern */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <filter
                id="headline-noise"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  stitchTiles="stitch"
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="
                    0 0 0 0 0.902
                    0 0 0 0 0.902
                    0 0 0 0 0.902
                    0 0 0 2 -0.8
                  "
                  result="threshold"
                />
                <feComposite
                  operator="in"
                  in="threshold"
                  in2="SourceGraphic"
                />
              </filter>
            </defs>
          </svg>

          <div ref={headlineContainerRef} className="relative mb-6">
            {/* Solid text — always visible */}
            <h1
              ref={headlineRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-text-primary"
            >
              <HeadlineWords showCursor={true} />
            </h1>

            {/* Noise overlay — cross-fades on hover */}
            <h1
              ref={noiseOverlayRef}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-text-primary absolute inset-0 pointer-events-none select-none"
              style={{ filter: "url(#headline-noise)" }}
              aria-hidden="true"
            >
              <HeadlineWords showCursor={true} />
            </h1>
          </div>

          {/* Subtext with selection highlight */}
          <p
            ref={subtextRef}
            className="text-text-muted text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Frontend developer building fast, clean interfaces — from{" "}
            <span className="relative inline-block rounded-sm bg-accent-dim px-0.5">
              <span className="relative z-10">production React apps</span>
              {/* Corner handle squares — styled like editor resize handles */}
              <span className="absolute -top-[4px] -left-[4px] w-[7px] h-[7px] border border-accent bg-editor-bg rounded-sm" />
              <span className="absolute -top-[4px] -right-[4px] w-[7px] h-[7px] border border-accent bg-editor-bg rounded-sm" />
              <span className="absolute -bottom-[4px] -left-[4px] w-[7px] h-[7px] border border-accent bg-editor-bg rounded-sm" />
              <span className="absolute -bottom-[4px] -right-[4px] w-[7px] h-[7px] border border-accent bg-editor-bg rounded-sm" />
            </span>{" "}
            to full 3D web experiences.
          </p>

          {/* Draggable chip */}
          <div className="flex justify-start mb-6">
            <DragChip />
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              ref={ctaPrimaryRef}
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-secondary text-[#0B0E14] text-sm font-mono font-medium hover:brightness-110 transition-all duration-200"
            >
              See the work <span className="text-lg leading-none">→</span>
            </a>
            <a
              ref={ctaSecondaryRef}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border-subtle text-text-muted text-sm font-mono font-medium hover:text-text-primary hover:border-white/25 transition-all duration-200"
            >
              Book a call
            </a>
          </div>

          {/* Corner copy */}
          <div className="flex justify-between w-full mt-16 px-2">
            <div ref={cornerLeftRef} className="text-left">
              <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                REMOTE · WORLDWIDE
              </p>
              <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                BASED IN BENGALURU, IN
              </p>
            </div>
            <div ref={cornerRightRef} className="text-right">
              <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                OPEN FOR WORK
              </p>
              <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                ANY TIMEZONE, HANDLED
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
