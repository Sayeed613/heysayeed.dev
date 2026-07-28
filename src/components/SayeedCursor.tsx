import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

const ARROW_SIZE = 28;
const SAYEED_COLOR = "#FF8A65";

interface SayeedCursorProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  phase: "idle" | "flying-to" | "grabbing" | "returning" | "flying-back";
  message: string;
}

export default function SayeedCursor({ springX, springY, phase, message }: SayeedCursorProps) {
  const showBubble = phase === "returning";
  const isActive = phase !== "idle";

  const arrowX = useSpring(springX, { stiffness: 380, damping: 32, mass: 0.6 });
  const arrowY = useSpring(springY, { stiffness: 380, damping: 32, mass: 0.6 });
  const labelX = useSpring(springX, { stiffness: 220, damping: 26, mass: 0.7 });
  const labelY = useSpring(springY, { stiffness: 220, damping: 26, mass: 0.7 });

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, { stiffness: 200, damping: 24, mass: 0.6 });
  const lastSample = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const unsubscribe = arrowX.on("change", (x) => {
      const y = arrowY.get();
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const last = lastSample.current;
      let vx = 0, vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSample.current = { x, y, t: now };
      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * 25);
    });
    return unsubscribe;
  }, [arrowX, arrowY, labelTiltTarget]);

  const labelTranslateX = useTransform(labelX, (v) => v + ARROW_SIZE * 0.9);
  const labelTranslateY = useTransform(labelY, (v) => v + ARROW_SIZE * 0.2 + 6);
  const bubbleX = useSpring(labelTranslateX, { stiffness: 150, damping: 18, mass: 0.8 });
  const bubbleY = useSpring(labelTranslateY, { stiffness: 150, damping: 18, mass: 0.8 });

  return (
    <CursorLayer visible={true} arrowX={arrowX} arrowY={arrowY}
      labelX={labelTranslateX} labelY={labelTranslateY} labelRotation={labelRotation}
      bubbleX={bubbleX} bubbleY={bubbleY} showBubble={showBubble} message={message}
      color={isActive ? SAYEED_COLOR : "rgba(107,114,128,.6)"}
      textColor={isActive ? "#fff" : "rgba(156,163,175,.9)"} label="Sayeed" />
  );
}

interface CursorLayerProps {
  visible: boolean; arrowX: MotionValue<number>; arrowY: MotionValue<number>;
  labelX: MotionValue<number>; labelY: MotionValue<number>;
  bubbleX: MotionValue<number>; bubbleY: MotionValue<number>;
  labelRotation: MotionValue<number>; color: string; textColor: string; label: string;
  showBubble: boolean; message: string;
}

function CursorLayer({ visible, arrowX, arrowY, labelX, labelY, bubbleX, bubbleY, labelRotation, color, textColor, label, showBubble, message }: CursorLayerProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }}>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: labelX, y: labelY, rotate: labelRotation, display: "flex", alignItems: "center", justifyContent: "center", height: 24, minWidth: 48, paddingInline: 8, background: color, borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,.18)", opacity: visible ? 1 : 0 }}>
        <span style={{ color: textColor, fontSize: 11, fontWeight: 700, lineHeight: "11px", transform: "translateY(-0.5px)", whiteSpace: "nowrap" }}>{label}</span>
      </motion.div>
      <AnimatePresence>
        {showBubble && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 8 }} transition={{ duration: 0.18 }}
            style={{ position: "absolute", top: 0, left: 0, x: bubbleX, y: useTransform(bubbleY, (v) => v + 48), background: "#ffffff", borderRadius: 8, padding: "10px 14px", maxWidth: 240, boxShadow: "0 12px 32px rgba(0,0,0,.18)", transformOrigin: "top left" }}>
            <div style={{ fontSize: 13, lineHeight: 1.35, color: "#111827", fontWeight: 500 }}>{message}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: arrowX, y: arrowY, opacity: visible ? 1 : 0 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 3 L23 14 L14 16 L11 24 Z" fill={color} stroke="rgba(0,0,0,.18)" strokeWidth=".6" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
