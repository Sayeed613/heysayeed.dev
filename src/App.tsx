import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import gsap from "gsap";
import ChromeBar from "./components/ChromeBar";
import AnimatedHeadline from "./components/AnimatedHeadline";
import MagneticButton from "./components/MagneticButton";
import SubheadingAnim from "./components/SubheadingAnim";
import VisitorCursor from "./components/VisitorCursor";
import SayeedCursor from "./components/SayeedCursor";
import BackgroundGrid from "./components/BackgroundGrid";
import SyntaxTokens from "./components/SyntaxTokens";
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
  const [sayeedPhase, setSayeedPhase] = useState<SayeedPhase>("idle");
  const [sarcasmMsg, setSarcasmMsg] = useState("");

  const badgeRef = useRef<HTMLDivElement>(null);
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

  // Original element center at grab time
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

  const pickMessage = useCallback(() => {
    const i = Math.floor(Math.random() * SARCASM_MESSAGES.length);
    setSarcasmMsg(SARCASM_MESSAGES[i]);
  }, []);

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

  const doGrab = useCallback(() => {
    const handle = subheadingRef.current;
    if (!handle) return;
    handle.grab();
    const rect = handle.getRect();
    const offset = handle.getDragOffset();
    if (rect) {
      origCenterRef.current = {
        x: rect.left + rect.width / 2 - offset.x,
        y: rect.top + rect.height / 2 - offset.y,
      };
    }
    const elCenterX = origCenterRef.current.x + offset.x;
    const elCenterY = origCenterRef.current.y + offset.y;
    sayeedX.jump(elCenterX + 24);
    sayeedY.jump(elCenterY - 12);
    pickMessage();
    setSayeedPhase("returning");
    const sbX = handle.dragX.on("change", (val: number) => {
      sayeedX.set(origCenterRef.current.x + val + 24);
    });
    const sbY = handle.dragY.on("change", (val: number) => {
      sayeedY.set(origCenterRef.current.y + val - 12);
    });
    unsubDrag.current = () => { sbX(); sbY(); };
    handle.animateToOrigin(() => {
      if (unsubDrag.current) unsubDrag.current();
      unsubDrag.current = null;
      setTimeout(flySayeedToIdle, 500);
    });
  }, [sayeedX, sayeedY, pickMessage, flySayeedToIdle]);

  const triggerIntervention = useCallback(() => {
    if (!sayeedIdleRef.current) return;
    const idleRect = sayeedIdleRef.current.getBoundingClientRect();
    const handle = subheadingRef.current;
    if (!handle) return;
    const subRect = handle.getRect();
    if (!subRect) return;
    const targetX = subRect.left + subRect.width / 2 + 24;
    const targetY = subRect.top + subRect.height / 2 - 12;
    setSayeedPhase("flying-to");
    sayeedX.jump(idleRect.left);
    sayeedY.jump(idleRect.top);
    animate(sayeedX, targetX, {
      type: "spring", stiffness: 50, damping: 10, mass: 1.5, onComplete: doGrab,
    });
    animate(sayeedY, targetY, {
      type: "spring", stiffness: 50, damping: 10, mass: 1.5,
    });
  }, [sayeedX, sayeedY, doGrab]);

  const handleDragStart = useCallback(() => {
    interventionTimer.current = setTimeout(triggerIntervention, 300);
  }, [triggerIntervention]);

  const handleDragEnd = useCallback(() => {
    if (interventionTimer.current) {
      clearTimeout(interventionTimer.current);
      interventionTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (interventionTimer.current) clearTimeout(interventionTimer.current);
      if (unsubDrag.current) unsubDrag.current();
    };
  }, []);

  const handleSubReady = useCallback(() => {
    document.querySelector(".glow-target")?.classList.add("glow-pulse");
    setDragChipReady(true);
  }, []);

  useEffect(() => {
    gsap.set("#chrome-bar", { opacity: 0, y: -8 });
    gsap.set(badgeRef.current, { opacity: 0, y: -10 });
    gsap.set(cornerLeftRef.current, { opacity: 0 });
    gsap.set(cornerRightRef.current, { opacity: 0 });
    gsap.set("#build-status", { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("#chrome-bar", { y: 0, opacity: 1, duration: 0.4 });
    tl.to("#build-status", { opacity: 1, duration: 0.3 }, "-=0.2");
    tl.to(badgeRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.15");
    tl.to({}, { duration: 0.3 });
    tl.to([cornerLeftRef.current, cornerRightRef.current], { opacity: 1, duration: 0.5 }, ">");

    const floatTweens: gsap.core.Tween[] = [];
    tl.call(() => {
      floatTweens.push(gsap.to(cornerLeftRef.current, { y: -2, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 2.5 }));
      floatTweens.push(gsap.to(cornerRightRef.current, { y: -2, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 3 }));
    });

    return () => { tl.kill(); floatTweens.forEach((t) => t.kill()); };
  }, []);

  return (
    <>
      <ChromeBar sayeedIdleRef={sayeedIdleRef} />
      <BackgroundGrid />
      <SyntaxTokens />
      <VisitorCursor />
      <SayeedCursor springX={sayeedSpringX} springY={sayeedSpringY} phase={sayeedPhase} message={sarcasmMsg} />
      <section id="home" className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-svh px-6 pt-[120px] pb-16">
        <div className="w-full max-w-6xl mx-auto">
          {/* Headline left + badge · Subheading + side-by-side buttons right */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 md:items-start">
            <div className="md:w-1/2 text-left flex flex-col gap-6">
              {/* Badge */}
              <div className="relative inline-block">
                <span className="absolute -top-2 -left-2 w-2 h-2 rounded-[2px] bg-accent border border-accent/80" />
                <span className="absolute -top-2 -right-2 w-2 h-2 rounded-[2px] bg-accent border border-accent/80" />
                <span className="absolute -bottom-2 -left-2 w-2 h-2 rounded-[2px] bg-accent border border-accent/80" />
                <span className="absolute -bottom-2 -right-2 w-2 h-2 rounded-[2px] bg-accent border border-accent/80" />
                <div ref={badgeRef} className="badge-float inline-flex items-center gap-2 rounded-md border border-accent-dim bg-[#1A1A1A]/80 backdrop-blur-xl px-5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                  <span className="font-mono text-[12px] font-medium lowercase tracking-[0.04em] text-text-primary">est.</span>
                  <span className="font-mono text-[12px] font-medium tracking-[0.08em] text-accent">2026</span>
                </div>
              </div>
              <AnimatedHeadline />
            </div>
            <div className="md:w-1/2">
              <SubheadingAnim ref={subheadingRef} dragChipReady={dragChipReady} onGlowReady={handleSubReady}
                interventionActive={sayeedPhase !== "idle"}
                onDragStateChange={(dragging) => { if (dragging) handleDragStart(); else handleDragEnd(); }} />
              <div className="flex flex-wrap gap-3 mt-6">
                <MagneticButton label="Start something →" link="#work" fill="#DC2626" textColor="#FFFFFF" sweepColor="#FFFFFF" sweepTextColor="#DC2626" radius={6} magnet={10} paddingX={24} paddingY={12} border={false}
                  font={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em" }} />
                <MagneticButton label="Sneak a peek" link="#contact" fill="transparent" textColor="#9CA3AF" sweepColor="rgba(220,38,38,0.15)" sweepTextColor="#F0F0F0" radius={6} magnet={10} paddingX={24} paddingY={12} border={true}
                  borderOptions={{ color: "rgba(255,255,255,0.12)", width: 1 }}
                  font={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Corner copy */}
        <div ref={cornerLeftRef} className="absolute left-6 bottom-16 text-left">
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">DESIGN. BUILD. SHIP.</p>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">REMOTE · WORLDWIDE</p>
        </div>
        <div ref={cornerRightRef} className="absolute right-6 bottom-16 text-right">
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">NO FLUFF. JUST SHIP.</p>
          <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">ANY TIMEZONE. HANDLED.</p>
        </div>
      </section>
    </>
  );
}

export default App;
