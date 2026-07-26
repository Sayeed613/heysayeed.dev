import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WORDS = "Ship fast. Break nothing.".split(" ");
const ACCENT_INDEX = 1;

const wordVariants = {
  hidden: {
    y: 50,
    opacity: 0,
    scale: 0.98,
    filter: "blur(10px)",
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
      mass: 0.8,
      delay: i * 0.13,
    },
  }),
};

export default function HeadlineAnim() {
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Show cursor after all words have animated in
  useEffect(() => {
    const totalAnimationTime = WORDS.length * 130 + 600; // stagger + spring settle
    const timer = setTimeout(() => {
      cursorRef.current?.classList.add("active");
    }, totalAnimationTime);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-[-0.05em] text-text-primary">
      {WORDS.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <motion.span
            className={`inline-block ${i === ACCENT_INDEX ? "text-accent" : ""}`}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            layout
            style={{ willChange: "transform, opacity, filter" }}
            whileHover={
              i === ACCENT_INDEX
                ? {
                    scale: 1.02,
                    color: "#22D3EE",
                    textShadow: "0 0 16px rgba(34, 211, 238, 0.5)",
                    transition: { type: "spring", stiffness: 200, damping: 12 },
                  }
                : {
                    scale: 1.02,
                    color: "#ffffff",
                    transition: { type: "spring", stiffness: 200, damping: 12 },
                  }
            }
          >
            {word}
            {i < WORDS.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
      <span
        ref={cursorRef}
        className="hero-cursor inline-block text-accent ml-0.5 font-mono font-light text-[0.6em] leading-none align-text-bottom -mb-[0.05em]"
      >
        |
      </span>
    </h1>
  );
}
