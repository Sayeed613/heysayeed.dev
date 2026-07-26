import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import gsap from "gsap";
import ChromeBar from "./components/ChromeBar";
import FloatingNav from "./components/FloatingNav";
import HeadlineAnim from "./components/HeadlineAnim";
import SubheadingAnim from "./components/SubheadingAnim";
import VisitorCursor from "./components/VisitorCursor";
import SayeedCursor from "./components/SayeedCursor";
import type { SubheadingHandle } from "./components/SubheadingAnim";

const SARCASM_MESSAGES = [
  "nice try.",
  "that's not where it goes.",
  "i spent hours aligning this.",
  "returning it to civilization...",
  "absolutely not.",
  "design privileges revoked.",
  "please stop helping.",
  "undoing your masterpiece...",
  "the layout was innocent.",
  "this is why i lock figma files.",
];

type SayeedPhase = "idle" | "flying-to" | "returning" | "flying-back";

function App() {
  const [dragChipReady, setDragChipReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sayeedPhase, setSayeedPhase] = useState<SayeedPhase>("idle");
  const [sarcasmMsg, setSarcasmMsg] = useState("");

  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaPrimaryRef = useRef<HTMLAnchorElement>(null);
  const ctaSecondaryRef = useRef<HTMLAnchorElement>(null);
  const cornerLeftRef = useRef<HTMLDivElement>(null);
  const cornerRightRef = useRef<HTMLDivElement>(null);
  const sayeedIdleRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<SubheadingHandle>(null);
  const interventionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubDrag = useRef<(() => void) | null>(null);

  // Sayeed position motion values
  const sayeedX = useMotionValue(0);
  const sayeedY = useMotionValue(0);
  const sayeedSpringX = useSpring(sayeedX, { stiffness: 200, damping: 22 });
  const sayeedSpringY = useSpring(sayeedY, { stiffness: 200, damping: 22 });

  // Original element center at grab time (used for tracking during return)
  const origCenterRef = useRef({ x: 0, y: 0 });

  // ─── Set cursor: none on mount ───────────────────────
  useEffect(() => {
    document.body.style.cursor = "none";
    return () => { document.body.style.cursor = ""; };
  }, []);

  // ─── Init Sayeed at idle position ────────────────────
  useEffect(() => {
    const initSayeed = () => {
      if (sayeedIdleRef.current) {
        const rect = sayeedIdleRef.current.getBoundingClientRect();
        sayeedX.set(rect.left);
        sayeedY.set(rect.top);
      }
    };
    initSayeed();
    window.addEventListener("resize", initSayeed);
    return () => window.removeEventListener("resize", initSayeed);
  }, [sayeedX, sayeedY]);

  // ─── Pick random sarcasm message ─────────────────────
  const pickMessage = useCallback(() => {
    const i = Math.floor(Math.random() * SARCASM_MESSAGES.length);
    setSarcasmMsg(SARCASM_MESSAGES[i]);
  }, []);

  // ─── Fly Sayeed back to idle ─────────────────────────
  const flySayeedToIdle = useCallback(() => {
    if (!sayeedIdleRef.current) return;
    const rect = sayeedIdleRef.current.getBoundingClientRect();
    setSayeedPhase("flying-back");
    animate(sayeedX, rect.left, {
      type: "spring", stiffness: 60, damping: 12, mass: 1.2,
      onComplete: () => setSayeedPhase("idle"),
    });
    animate(sayeedY, rect.top, {
      type: "spring", stiffness: 60, damping: 12, mass: 1.2,
    });
  }, [sayeedX, sayeedY]);

  // ─── Grab + return sequence ──────────────────────────
  const doGrab = useCallback(() => {
    const handle = subheadingRef.current;
    if (!handle) return;

    // Disable further user drag
    handle.grab();
    setIsDragging(false);

    // Record element's current center for position tracking
    const rect = handle.getRect();
    const offset = handle.getDragOffset();
    if (rect) {
      origCenterRef.current = {
        x: rect.left + rect.width / 2 - offset.x,
        y: rect.top + rect.height / 2 - offset.y,
      };
    }

    // Jump Sayeed to element's current position (with offset)
    const elCenterX = origCenterRef.current.x + offset.x;
    const elCenterY = origCenterRef.current.y + offset.y;
    sayeedX.jump(elCenterX + 24);
    sayeedY.jump(elCenterY - 12);

    // Pick random message
    pickMessage();
    setSayeedPhase("returning");

    // Subscribe to drag tracking — Sayeed follows the element back
    const sbX = handle.dragX.on("change", (val: number) => {
      sayeedX.set(origCenterRef.current.x + val + 24);
    });
    const sbY = handle.dragY.on("change", (val: number) => {
      sayeedY.set(origCenterRef.current.y + val - 12);
    });
    unsubDrag.current = () => { sbX(); sbY(); };

    // Animate element back to origin with spring
    handle.animateToOrigin(() => {
      // Return complete — cleanup tracking, fly Sayeed back
      if (unsubDrag.current) unsubDrag.current();
      unsubDrag.current = null;

      // Brief pause, then Sayeed returns to navbar
      setTimeout(flySayeedToIdle, 500);
    });
  }, [sayeedX, sayeedY, pickMessage, flySayeedToIdle]);

  // ─── Trigger intervention after 300ms delay ──────────
  const triggerIntervention = useCallback(() => {
    if (!sayeedIdleRef.current) return;

    const idleRect = sayeedIdleRef.current.getBoundingClientRect();
    const handle = subheadingRef.current;
    if (!handle) return;

    const subRect = handle.getRect();
    if (!subRect) return;

    const targetX = subRect.left + subRect.width / 2 + 24;
    const targetY = subRect.top + subRect.height / 2 - 12;

    // Fly Sayeed from idle to subheading
    setSayeedPhase("flying-to");

    // First, ensure Sayeed starts at idle position
    sayeedX.jump(idleRect.left);
    sayeedY.jump(idleRect.top);

    // Then animate to target (slower spring for a more deliberate walk)
    animate(sayeedX, targetX, {
      type: "spring", stiffness: 50, damping: 10, mass: 1.5,
      onComplete: doGrab,
    });
    animate(sayeedY, targetY, {
      type: "spring", stiffness: 50, damping: 10, mass: 1.5,
    });
  }, [sayeedX, sayeedY, doGrab]);

  // ─── Called when user starts dragging ────────────────
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    interventionTimer.current = setTimeout(() => {
      triggerIntervention();
    }, 300);
  }, [triggerIntervention]);

  // ─── Called when user releases before intervention ───
  const handleDragEnd = useCallback(() => {
    if (interventionTimer.current) {
      clearTimeout(interventionTimer.current);
      interventionTimer.current = null;
    }
    setIsDragging(false);
  }, []);

  // ─── Cleanup on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      if (interventionTimer.current) clearTimeout(interventionTimer.current);
      if (unsubDrag.current) unsubDrag.current();
    };
  }, []);

  // ─── GSAP entrance animations ────────────────────────
  const handleSubReady = useCallback(() => {
    document.querySelector(".glow-target")?.classList.add("glow-pulse");
    document.querySelectorAll(".border-target").forEach((el) => el.classList.add("border-pulse"));
    setDragChipReady(true);
  }, []);

  useEffect(() => {
    gsap.set("#chrome-bar", { opacity: 0, y: -8 });
    gsap.set("#floating-nav", { opacity: 0, y: -15 });
    gsap.set(badgeRef.current, { opacity: 0, y: -10 });
    gsap.set(ctaPrimaryRef.current, { opacity: 0, y: 15, scale: 0.95 });
    gsap.set(ctaSecondaryRef.current, { opacity: 0, y: 10 });
    gsap.set(cornerLeftRef.current, { opacity: 0 });
    gsap.set(cornerRightRef.current, { opacity: 0 });
    gsap.set("#build-status", { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to("#chrome-bar", { y: 0, opacity: 1, duration: 0.4 });
    tl.to("#build-status", { opacity: 1, duration: 0.3 }, "-=0.2");
    tl.to("#floating-nav", { y: 0, opacity: 1, duration: 0.5 }, "-=0.35");
    tl.to(badgeRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.15");
    tl.to({}, { duration: 2.6 });
    tl.to(ctaPrimaryRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.5 }, ">");
    tl.to(ctaSecondaryRef.current, { y: 0, opacity: 1, duration: 0.4 }, "-=0.1");
    tl.to([cornerLeftRef.current, cornerRightRef.current], { opacity: 1, duration: 0.5 }, ">");

    return () => tl.kill();
  }, []);

  return (
    <>
      <ChromeBar sayeedIdleRef={sayeedIdleRef} />
      <FloatingNav />

      {/* ─── Global cursors (render above everything) ──── */}
      <VisitorCursor />
      <SayeedCursor
        springX={sayeedSpringX}
        springY={sayeedSpringY}
        phase={sayeedPhase}
        message={sarcasmMsg}
      />

      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />

      <section
        id="home"
        className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-svh px-6 pt-[120px] pb-16"
      >
        <div className="max-w-3xl w-full text-center">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="badge-float inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-editor-surface text-text-muted text-[11px] font-mono tracking-wide mb-6"
          >
            building in public — 2026
          </div>

          {/* Headline */}
          <div className="relative mb-8">
            <HeadlineAnim />
          </div>

          {/* Subheading — draggable */}
          <SubheadingAnim
            ref={subheadingRef}
            dragChipReady={dragChipReady}
            onGlowReady={handleSubReady}
            interventionActive={sayeedPhase !== "idle"}
            onDragStateChange={(dragging) => {
              if (dragging) handleDragStart();
              else handleDragEnd();
            }}
          />

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              ref={ctaPrimaryRef}
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent-secondary text-[#0B0E14] text-sm font-mono font-medium hover:brightness-110 transition-all duration-200"
            >
              See the work <span className="text-lg leading-none">→</span>
            </a>
            <a
              ref={ctaSecondaryRef}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border-subtle text-text-muted text-sm font-mono font-medium hover:text-text-primary hover:border-white/25 transition-all duration-200"
            >
              Book a call
            </a>
          </div>

          {/* Decorative rectangle */}
          <div className="flex justify-center mt-8">
            <span className="block w-6 h-1 rounded-full bg-accent/60" />
          </div>
        </div>

        {/* Corner copy — at the far edges of the section */}
        <div ref={cornerLeftRef} className="absolute left-6 bottom-16 text-left">
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">REMOTE · WORLDWIDE</p>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">BASED IN BENGALURU, IN</p>
        </div>
        <div ref={cornerRightRef} className="absolute right-6 bottom-16 text-right">
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">OPEN FOR WORK</p>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">ANY TIMEZONE, HANDLED</p>
        </div>
      </section>
    </>
  );
}

export default App;
