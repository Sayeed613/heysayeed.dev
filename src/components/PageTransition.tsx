import { createContext, useCallback, useContext, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionCtx {
  navigateTo: (target: string, color?: string) => void;
}

const Ctx = createContext<TransitionCtx>({ navigateTo: () => {} });

export function useTransition() {
  return useContext(Ctx);
}

/** Section-to-color mapping — the curtain matches the destination */
const SECTION_COLORS: Record<string, string> = {
  "#top": "#0A0A0A",
  "#work": "#0A0A0A",
  "#about": "#0F141A",
  "#services": "#0A0A0A",
  "#contact": "#0A0A0A",
};

const DEFAULT_COLOR = "#0A0A0A";

function colorFor(target: string, override?: string) {
  return override ?? SECTION_COLORS[target] ?? DEFAULT_COLOR;
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const targetRef = useRef<string>("");
  const colorRef = useRef<string>("#0A0A0A");

  const navigateTo = useCallback((target: string, color?: string) => {
    if (phase !== "idle") return;
    targetRef.current = target;
    colorRef.current = colorFor(target, color);
    setPhase("in");
  }, [phase]);

  return (
    <Ctx.Provider value={{ navigateTo }}>
      {children}

      <AnimatePresence>
        {phase === "in" && (
          <motion.div
            key="curtain-in"
            className="fixed inset-0 z-[9999]"
            style={{ background: colorRef.current }}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.5,
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => {
              const el = document.querySelector(targetRef.current);
              if (el) {
                el.scrollIntoView({ behavior: "instant" });
              }
              setPhase("out");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "out" && (
          <motion.div
            key="curtain-out"
            className="fixed inset-0 z-[9999]"
            style={{ background: colorRef.current }}
            initial={{ x: "0%" }}
            animate={{ x: "100%" }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.5,
              ease: [0.76, 0, 0.24, 1],
            }}
            onAnimationComplete={() => setPhase("idle")}
          />
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
