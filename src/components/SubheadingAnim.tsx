import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  animate,
  type MotionValue,
} from "framer-motion";

export interface SubheadingHandle {
  getRect: () => DOMRect | null;
  getDragOffset: () => { x: number; y: number };
  animateToOrigin: (onComplete?: () => void) => void;
  grab: (cb?: () => void) => void;
  dragX: MotionValue<number>;
  dragY: MotionValue<number>;
}

interface Props {
  dragChipReady: boolean;
  onGlowReady?: () => void;
  onDragStateChange?: (dragging: boolean) => void;
  interventionActive?: boolean;
}

const subVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)", scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      type: "spring", stiffness: 80, damping: 16, mass: 0.8, delay: 2.1,
    },
  },
};

function HighlightText() {
  return (
    <span className="glow-target relative inline-block rounded-[6px] bg-accent-dim/30 px-1">
      <span className="relative z-10">production React apps</span>
    </span>
  );
}

const SubheadingAnim = forwardRef<SubheadingHandle, Props>(
  ({ dragChipReady, onGlowReady, onDragStateChange, interventionActive }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);
    const dragCycleRef = useRef(0);
    const [phase, setPhase] = useState<"idle" | "dragging" | "grabbed">("idle");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Force reinitialize Framer Motion's drag system by cycling the key
    const dragKey = `drag-${dragCycleRef.current}`;

    // ─── Imperative handle for parent ────────────────────
    useImperativeHandle(ref, () => ({
      getRect: () => containerRef.current?.getBoundingClientRect() ?? null,
      getDragOffset: () => ({ x: dragX.get(), y: dragY.get() }),
      dragX,
      dragY,
      animateToOrigin: (onComplete) => {
        setPhase("grabbed");
        animate(dragX, 0, {
          type: "spring", stiffness: 120, damping: 14, mass: 0.8,
          onComplete: () => {
            setPhase("idle");
            dragCycleRef.current += 1; // cycle key to re-init drag
            onComplete?.();
          },
        });
        animate(dragY, 0, {
          type: "spring", stiffness: 120, damping: 14, mass: 0.8,
        });
      },
      grab: () => {
        setPhase("grabbed");
      },
    }), [dragX, dragY]);

    // ─── Drag handlers ────────────────────────────────────
    const handleDragStart = useCallback(() => {
      setPhase("dragging");
      onDragStateChange?.(true);
    }, [onDragStateChange]);

    const handleDrag = useCallback(
      (_: any, info: any) => {
        dragX.set(info.offset.x);
        dragY.set(info.offset.y);
        setMousePos({ x: info.point.x, y: info.point.y });
      },
      [dragX, dragY],
    );

    const handleDragEnd = useCallback(() => {
      if (phase === "dragging") {
        if (interventionActive) {
          return;
        }
        setPhase("idle");
        onDragStateChange?.(false);
        animate(dragX, 0, { type: "spring", stiffness: 250, damping: 22 });
        animate(dragY, 0, { type: "spring", stiffness: 250, damping: 22 });
      }
    }, [phase, interventionActive, onDragStateChange, dragX, dragY]);

    // ─── Mouse parallax ──────────────────────────────────
    const parallaxX = useMotionValue(0);
    const parallaxY = useMotionValue(0);
    const springPX = useSpring(parallaxX, { stiffness: 150, damping: 15 });
    const springPY = useSpring(parallaxY, { stiffness: 150, damping: 15 });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        if (phase !== "idle" || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        parallaxX.set(dx * 5);
        parallaxY.set(dy * 5);
      },
      [phase, parallaxX, parallaxY],
    );

    const handleMouseLeave = useCallback(() => {
      animate(parallaxX, 0, { type: "spring", stiffness: 150, damping: 15 });
      animate(parallaxY, 0, { type: "spring", stiffness: 150, damping: 15 });
    }, [parallaxX, parallaxY]);

    // ─── Drag allowed only when idle or dragging ────────
    const canDrag = phase === "idle" || phase === "dragging";

    return (
      <div className="relative max-w-[680px] mx-auto mt-8 mb-8">
        <p className="text-center text-text-muted/50 text-[11px] font-mono tracking-wide mb-1 select-none">
          // we don't do forgetable
        </p>

        {/* ─── Draggable container ─────────────────────────── */}
        <motion.div
          key={dragKey}
          ref={containerRef}
          className="relative"
          drag={canDrag}
          dragMomentum={false}
          dragElastic={0.1}
          style={{ x: dragX, y: dragY, zIndex: 10 }}
          whileDrag={{ scale: 1.01, transition: { duration: 0.12 } }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Selection border */}
          <div
            className="absolute inset-0 border-2 pointer-events-none"
                      style={{
              borderColor:
                phase === "grabbed"
                  ? "rgba(156,163,175,0.5)" // gray-400
                  : "rgba(107,114,128,0.4)", // gray-500
              borderStyle: "dashed",
            }}
          />

          {/* Resize handles — square corners */}
          <span className="absolute -top-[5px] -left-[5px] w-[9px] h-[9px] border-2 border-accent bg-editor-bg" />
          <span className="absolute -top-[5px] -right-[5px] w-[9px] h-[9px] border-2 border-accent bg-editor-bg" />
          <span className="absolute -bottom-[5px] -left-[5px] w-[9px] h-[9px] border-2 border-accent bg-editor-bg" />
          <span className="absolute -bottom-[5px] -right-[5px] w-[9px] h-[9px] border-2 border-accent bg-editor-bg" />

          {/* "do not drag" badge */}
          <motion.div
            className="absolute -top-[24px] left-2 z-10"
            initial={{ opacity: 0, x: -8 }}
            animate={dragChipReady ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          >
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-mono tracking-wider text-text-muted bg-editor-bg border border-border-subtle rounded-[2px] select-none">
              do not drag
            </span>
          </motion.div>

          {/* Subtext — initial={false} to prevent replay on remount */}
          <motion.p
            variants={subVariants}
            initial={false}
            animate="visible"
            onAnimationComplete={() => { onGlowReady?.(); }}
            className="text-[rgba(240,240,240,0.8)] text-md sm:text-lg md:text-[24px] font-[400] leading-[1.45] tracking-[-0.02em] px-5 pt-6 pb-4 select-none"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              x: springPX,
              y: springPY,
            }}
            whileHover={{
              color: "rgba(240,240,240,1)",
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            Frontend developer building fast, clean interfaces — from{" "}
            <HighlightText /> to full 3D web experiences.
          </motion.p>
        </motion.div>

        {/* ─── "you" cursor during drag (before Sayeed arrives) ──── */}
        <AnimatePresence>
          {phase === "dragging" && (
            <motion.div
              key="you-cursor"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="fixed pointer-events-none z-[9998] flex flex-col items-center px-2 py-1 rounded-[3px] bg-editor-bg/80 border border-accent/30 shadow-lg shadow-black/30 backdrop-blur-sm"
              style={{ left: mousePos.x + 14, top: mousePos.y + 16 }}
            >
              <span className="text-accent text-[10px] font-mono font-medium whitespace-nowrap tracking-wide leading-none">
                you
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

SubheadingAnim.displayName = "SubheadingAnim";
export default SubheadingAnim;
