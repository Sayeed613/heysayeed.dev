import { useEffect, useMemo, useRef, useState } from "react";
import { motion, animate, useMotionValue, useSpring, useTransform, type MotionValue, type SpringOptions } from "framer-motion";

const ARROW_COLOR = "#DC2626";
const ARROW_SIZE = 28;

export default function VisitorCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hovering, setHovering] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(mql.matches);
    sync();
    if (mql.addEventListener) { mql.addEventListener("change", sync); return () => mql.removeEventListener("change", sync); }
    mql.addListener(sync);
    return () => mql.removeListener(sync);
  }, []);

  const arrowSpring = useMemo<SpringOptions>(() => ({ stiffness: 380, damping: 32, mass: 0.6 }), []);
  const labelSpring = useMemo<SpringOptions>(() => ({ stiffness: 220, damping: 26, mass: 0.7 }), []);

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const arrowX = useSpring(mouseX, arrowSpring);
  const arrowY = useSpring(mouseY, arrowSpring);
  const labelX = useSpring(mouseX, labelSpring);
  const labelY = useSpring(mouseY, labelSpring);
  const scaleMV = useMotionValue(1);

  useEffect(() => {
    const controls = animate(scaleMV, pressed ? 0.92 : 1, { type: "spring", stiffness: 500, damping: 28, mass: 0.5 });
    return () => controls.stop();
  }, [pressed, scaleMV]);

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, { stiffness: 200, damping: 24, mass: 0.6 });
  const lastSample = useRef<{ x: number; y: number; t: number } | null>(null);
  const clickableCounter = useRef(0);

  useEffect(() => {
    if (isTouchDevice) return;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const last = lastSample.current;
      let vx = 0, vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSample.current = { x, y, t: now };
      mouseX.set(x);
      mouseY.set(y);
      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * 25);
      if (last) clickableCounter.current += Math.hypot(x - last.x, y - last.y);
      if (clickableCounter.current > 80) {
        clickableCounter.current = 0;
        const el = document.elementFromPoint(x, y);
        if (el) setIsClickable(Boolean(el.closest('a,button,input,select,textarea,summary,label,[role="button"],[onclick],[data-clickable]')));
      }
      setHovering(true);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => { lastSample.current = null; labelTiltTarget.set(0); };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [isTouchDevice, mouseX, mouseY, labelTiltTarget]);

  const labelTranslateX = useTransform(labelX, (v) => v + ARROW_SIZE * 0.9);
  const labelTranslateY = useTransform(labelY, (v) => v + ARROW_SIZE * 0.2 + 6);

  if (isTouchDevice) return null;

  return (
    <CursorLayer visible={hovering} arrowX={arrowX} arrowY={arrowY}
      labelX={labelTranslateX} labelY={labelTranslateY} labelRotation={labelRotation}
      scale={scaleMV} color={isClickable ? "#DC2626" : ARROW_COLOR}
      textColor="#FFFFFF" label={isClickable ? "Click" : "You"} />
  );
}

interface CursorLayerProps {
  visible: boolean; arrowX: MotionValue<number>; arrowY: MotionValue<number>;
  labelX: MotionValue<number>; labelY: MotionValue<number>;
  labelRotation: MotionValue<number>; scale: MotionValue<number>;
  color: string; textColor: string; label: string;
}

function CursorLayer({ visible, arrowX, arrowY, labelX, labelY, labelRotation, scale, color, textColor, label }: CursorLayerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none select-none" style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: labelX, y: labelY, rotate: labelRotation, scale, display: "flex", alignItems: "center", justifyContent: "center", height: 24, minWidth: 40, paddingInline: 8, background: color, borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,.18)", opacity: visible ? 1 : 0, transformOrigin: "0% 50%", pointerEvents: "none" }}>
        <span style={{ color: "#FFFFFF", fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif', fontWeight: 700, fontSize: 11, lineHeight: "11px", display: "block", transform: "translateY(-0.5px)" }}>{label}</span>
      </motion.div>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: arrowX, y: arrowY, scale, width: ARROW_SIZE, height: ARROW_SIZE, opacity: visible ? 1 : 0, transformOrigin: "0% 0%", transition: "opacity 140ms ease", willChange: "transform, opacity", pointerEvents: "none" }}>
        <svg width={ARROW_SIZE} height={ARROW_SIZE} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 1px 3px rgba(0,0,0,.4))" }}>
          <path d="M5 3 L23 14 L14 16 L11 24 Z" fill={color} stroke="rgba(0,0,0,.18)" strokeWidth={0.6} strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
