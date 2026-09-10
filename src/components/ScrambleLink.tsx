import { useEffect, useRef } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&*+=?";

/**
 * Scrambles the element's text on hover, resolving characters
 * left-to-right — replicates the site's GSAP ScrambleTextPlugin
 * `data-scramble-hover` effect without the dependency.
 */
export function useScramble(text: string, duration = 500) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = text;
  }, [text]);

  const play = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(t * text.length);
      let out = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const ch = text[i];
        out += ch === " " ? " " : POOL[(Math.random() * POOL.length) | 0];
      }
      el.textContent = out;
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, play };
}

interface ScrambleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  duration?: number;
}

/** Anchor whose label scrambles on hover, like revelatio.studio footer links. */
export default function ScrambleLink({ label, duration = 500, children, ...rest }: ScrambleLinkProps) {
  const { ref, play } = useScramble(label, duration);
  return (
    <a {...rest} onMouseEnter={play} data-scramble-hover="link">
      <span ref={ref as React.RefObject<HTMLSpanElement>} data-scramble-hover="target">
        {label}
      </span>
      {children}
    </a>
  );
}
