import { useState, useRef, useCallback, useEffect } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#°±§";

interface ScrambleTextProps {
  text: string;
  accentIndex?: number;
  className?: string;
  /** Delay in ms before auto-scramble starts (default 0). Set to >2000 to avoid GSAP entrance race. */
  delay?: number;
}

export default function ScrambleText({
  text,
  accentIndex = -1,
  className = "",
  delay = 0,
}: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settledRef = useRef(false);
  const currentFrame = useRef(0);
  const mountedRef = useRef(true);

  const getScrambled = useCallback(
    (target: string, progress: number): string => {
      const total = target.length;
      const settledCount = Math.floor(progress * total);
      return target
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < settledCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
    },
    [],
  );

  const startScramble = useCallback(() => {
    if (settledRef.current || !mountedRef.current) return;
    currentFrame.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const totalFrames = Math.floor(Math.random() * 8 + 12);

    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      currentFrame.current++;
      const progress = Math.min(currentFrame.current / totalFrames, 1);

      const staggeredProgress = progress < 0.3 ? 0 : (progress - 0.3) / 0.7;
      setDisplayedText(getScrambled(text, staggeredProgress));

      if (progress >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayedText(text);
        settledRef.current = true;
      }
    }, 50);
  }, [text, getScrambled]);

  // Auto-scramble after delay
  useEffect(() => {
    mountedRef.current = true;

    // Skip on touch devices
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches;
    if (isTouch) return;

    const timer = setTimeout(startScramble, delay);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [delay, startScramble]);

  const words = displayedText.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`hero-word inline-block ${i === accentIndex ? "text-accent" : ""}`}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
