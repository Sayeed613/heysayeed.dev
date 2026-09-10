import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxBg — global ambient background with layered geometric shapes
 * that scroll at different speeds (GSAP) with anime.js-driven floating,
 * pulsing, and path-drawing animations.
 *
 * Three layers:
 *   1. Deep layer (slow) — large circles with breathing animation
 *   2. Mid layer (medium) — horizontal lines with path-drawing on scroll
 *   3. Near layer (fast) — small dots with pulsing and mouse-reactive drift
 */
export default function ParallaxBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── anime.js: floating shapes + pulsing ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Breathing circles — scale pulse
    animate(container.querySelectorAll(".pb-breathe"), {
      scale: [
        { value: 1, duration: 2000 },
        { value: 1.08, duration: 2000 },
      ],
      loop: true,
      ease: "inOutQuad",
      direction: "alternate",
    });

    // Floating dots — subtle Y drift
    animate(container.querySelectorAll(".pb-float"), {
      translateY: [
        { value: -8, duration: 1800 },
        { value: 8, duration: 1800 },
      ],
      loop: true,
      ease: "inOutSine",
      direction: "alternate",
    });

    // Rotating plus marks
    animate(container.querySelectorAll(".pb-spin"), {
      rotate: "1turn",
      loop: true,
      ease: "linear",
      duration: 24000,
    });
  }, []);

  // ── GSAP: scroll parallax + mouse lean ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Deep layer: slow upward drift
      gsap.utils.toArray<HTMLElement>(".pb-deep").forEach((el, i) => {
        gsap.to(el, {
          y: () => -(100 + i * 50),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      });

      // Mid layer: medium speed
      gsap.utils.toArray<HTMLElement>(".pb-mid").forEach((el, i) => {
        gsap.to(el, {
          y: () => -(240 + i * 70),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.0,
          },
        });
      });

      // Near layer: fast
      gsap.utils.toArray<HTMLElement>(".pb-near").forEach((el, i) => {
        gsap.to(el, {
          y: () => -(420 + i * 90),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      });

      // Horizontal drift
      gsap.utils.toArray<HTMLElement>(".pb-drift").forEach((el, i) => {
        gsap.to(el, {
          x: () => (i % 2 === 0 ? 50 : -50),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 2.0,
          },
        });
      });
    }, container);

    // Mouse lean on deep layer
    let mx = 0;
    const deepEls = container.querySelectorAll<HTMLElement>(".pb-deep");

    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
    };

    const tick = () => {
      deepEls.forEach((el, i) => {
        const strength = 10 + i * 4;
        gsap.to(el, {
          x: mx * strength,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    const raf = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ═══════════════════════════════════════════════════════
          DEEP LAYER — large shapes, slow parallax
         ═══════════════════════════════════════════════════════ */}

      {/* Large circle — top right, breathing */}
      <div
        className="pb-deep pb-breathe absolute rounded-full border border-white/[0.12]"
        style={{
          width: "38vw",
          height: "38vw",
          top: "5vh",
          right: "-6vw",
        }}
      />

      {/* Large circle — bottom left, drifting */}
      <div
        className="pb-deep pb-drift absolute rounded-full border border-white/[0.10]"
        style={{
          width: "32vw",
          height: "32vw",
          bottom: "8vh",
          left: "-4vw",
        }}
      />

      {/* Orange accent glow — center */}
      <div
        className="pb-deep absolute rounded-full"
        style={{
          width: "50vw",
          height: "26vw",
          top: "42vh",
          left: "25vw",
          background: "radial-gradient(ellipse, rgba(255,74,31,0.05), transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          MID LAYER — lines, rectangles, animated arcs
         ═══════════════════════════════════════════════════════ */}

      {/* Long line — upper third */}
      <div
        className="pb-mid absolute h-px bg-white/[0.12]"
        style={{ width: "55vw", top: "28vh", left: "8vw" }}
      />

      {/* Shorter line — middle */}
      <div
        className="pb-mid pb-drift absolute h-px bg-white/[0.10]"
        style={{ width: "30vw", top: "52vh", right: "12vw" }}
      />

      {/* Long line — lower third */}
      <div
        className="pb-mid absolute h-px bg-white/[0.10]"
        style={{ width: "65vw", top: "74vh", left: "15vw" }}
      />

      {/* Rectangle outline — center left */}
      <div
        className="pb-mid absolute border border-white/[0.08]"
        style={{ width: "14vw", height: "8vw", top: "38vh", left: "3vw" }}
      />

      {/* Rectangle outline — right side */}
      <div
        className="pb-mid pb-drift absolute border border-white/[0.08]"
        style={{ width: "10vw", height: "16vw", top: "55vh", right: "6vw" }}
      />

      {/* Animated dashed arcs — anime.js path drawing */}
      <svg
        className="pb-mid absolute"
        style={{ width: "26vw", height: "26vw", top: "12vh", left: "5vw" }}
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          className="pb-draw"
          cx="100"
          cy="100"
          r="96"
          stroke="var(--line)"
          strokeWidth="0.8"
          strokeDasharray="4 16"
        />
      </svg>
      <svg
        className="pb-mid absolute"
        style={{ width: "22vw", height: "22vw", top: "60vh", right: "8vw" }}
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          className="pb-draw"
          cx="100"
          cy="100"
          r="88"
          stroke="rgba(255,74,31,0.08)"
          strokeWidth="0.6"
          strokeDasharray="3 20"
        />
      </svg>

      {/* ═══════════════════════════════════════════════════════
          NEAR LAYER — dots, plus marks, fast
         ═══════════════════════════════════════════════════════ */}

      {/* Pulsing dots */}
      {[
        { x: "12%", y: "15%", s: 4 },
        { x: "82%", y: "22%", s: 3.5 },
        { x: "45%", y: "35%", s: 3 },
        { x: "70%", y: "48%", s: 4 },
        { x: "20%", y: "62%", s: 3.5 },
        { x: "88%", y: "70%", s: 3 },
        { x: "35%", y: "85%", s: 4 },
      ].map((dot, i) => (
        <div
          key={i}
          className="pb-near pb-float absolute rounded-full bg-white/[0.18]"
          style={{
            width: dot.s,
            height: dot.s,
            left: dot.x,
            top: dot.y,
          }}
        />
      ))}

      {/* Spinning plus marks */}
      <svg className="pb-near pb-spin absolute" style={{ left: "18%", top: "30%" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0V12M0 6H12" stroke="var(--line-strong)" strokeWidth="1" />
      </svg>
      <svg className="pb-near pb-spin absolute" style={{ right: "22%", top: "58%" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0V12M0 6H12" stroke="var(--line-strong)" strokeWidth="1" />
      </svg>
      <svg className="pb-near pb-spin absolute" style={{ left: "55%", top: "78%" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0V12M0 6H12" stroke="var(--line-strong)" strokeWidth="1" />
      </svg>
    </div>
  );
}
