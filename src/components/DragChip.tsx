import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

interface DragChipProps {
  visible?: boolean;
}

export default function DragChip({ visible = false }: DragChipProps) {
  const isTouch = useIsTouchDevice();
  const hasAnimated = useRef(false);
  const [show, setShow] = useState(false);

  // Terminal slide-in from left
  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, [visible]);

  if (isTouch) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-editor-gutter/60 border border-border-subtle/60 select-none shadow-sm shadow-black/20"
      style={{ touchAction: "none" }}
    >
      <span className="text-text-muted/80 text-[11px] font-mono leading-none tracking-wide">-</span>
      <span className="text-text-muted text-[11px] font-mono leading-none tracking-wide">do not drag</span>
    </motion.div>
  );
}
