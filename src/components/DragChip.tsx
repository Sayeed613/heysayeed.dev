import { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 768px)").matches,
    );
  }, []);
  return isTouch;
}

export default function DragChip() {
  const isTouch = useIsTouchDevice();
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent) => {
      setIsDragging(true);
    },
    [],
  );

  const handleDrag = useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { point: { x: number; y: number } },
    ) => {
      setMousePos({ x: info.point.x, y: info.point.y });
    },
    [],
  );

  const handleDragEnd = useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number; y: number }; velocity: { x: number; y: number } },
    ) => {
      setIsDragging(false);

      // Spring back to origin with slight resistance based on throw velocity
      controls.start({
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
          velocity: Math.min(Math.abs(info.velocity.x), 800),
        },
      });
    },
    [controls],
  );

  // Enter animation
  useEffect(() => {
    controls.set({ opacity: 0, y: 8 });
    controls.start({ opacity: 1, y: 0, transition: { delay: 2.2, duration: 0.4, ease: "easeOut" } });
  }, [controls]);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.25}
        whileDrag={{ scale: 1.08, cursor: "grabbing" }}
        animate={controls}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-editor-gutter/50 border border-border-subtle cursor-grab select-none"
        style={{ touchAction: "none" }}
      >
        <span className="text-text-muted/60 text-[11px] font-mono leading-none">
          //
        </span>
        <span className="text-text-muted text-[11px] font-mono leading-none">
          do not touch
        </span>
      </motion.div>

      {/* Cursor-following tag — shown only while dragging */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed pointer-events-none z-50 flex items-center gap-1.5 px-2 py-1 rounded bg-editor-bg border border-accent/40 shadow-lg shadow-black/30"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y - 24,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-text-muted text-[10px] font-mono whitespace-nowrap tracking-wide">
            heysayeed — editing
          </span>
        </motion.div>
      )}
    </>
  );
}
