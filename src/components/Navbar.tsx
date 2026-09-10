import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTransition } from "./PageTransition";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#services" },
  { label: "Contact", href: "#contact" },
];

/** L-shaped SVG corner bracket. */
function Corner({ className }: { className: string }) {
  return (
    <svg
      className={`pointer-events-none absolute h-5 w-5 text-white/40 transition-colors duration-500 group-hover:text-white/70 ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 19 L1 1 L19 1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Typing logo — types out "heysayeed.dev" with original monospace style. */
function TypingLogo() {
  const full = "heysayeed.dev";
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCount(i);
      if (i >= full.length) clearInterval(timer);
    }, 140);
    return () => clearInterval(timer);
  }, []);

  return (
    <svg
      width="160"
      height="26"
      viewBox="0 0 160 26"
      fill="none"
      aria-hidden="true"
      className="text-white"
    >
      <text
        x="0"
        y="20"
        fill="currentColor"
        fontFamily="Menlo, Monaco, 'Courier New', monospace"
        fontSize="20"
        fontWeight="700"
        letterSpacing="-1"
      >
        {full.slice(0, count)}
      </text>
      {/* Blinking cursor */}
      <rect
        x={Math.min(count * 11.2, 148)}
        y="4"
        width="7"
        height="16"
        fill="currentColor"
        opacity="1"
      >
        <animate
          attributeName="opacity"
          values="1;1;0;0"
          keyTimes="0;0.5;0.5;1"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

/** Hamburger icon that morphs into an X when open. */
function BurgerIcon({ open }: { open: boolean }) {
  const bar = (offset: number, rotate: number): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: "50%",
    width: 20,
    height: 2,
    marginTop: -1,
    borderRadius: 2,
    background: "currentColor",
    transform: `translateY(${open ? 0 : offset}px) rotate(${open ? rotate : 0}deg)`,
    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  });
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span style={bar(-4, 45)} />
      <span style={bar(4, -45)} />
    </span>
  );
}

/**
 * Corner HUD navbar — four SVG brackets frame the viewport, typing logo
 * top-left, links top-right (desktop), hamburger on mobile with a
 * full-screen slide-in menu. Hides on scroll down, returns on scroll up.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { navigateTo } = useTransition();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      } else if (y < lastY.current - 4) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    navigateTo(href);
  };

  return (
    <>
      <header
        className={`group fixed inset-x-0 top-0 z-[9000] px-6 pt-4 md:px-10 md:pt-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !menuOpen ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <Corner className="left-3 top-3 md:left-4 md:top-4" />
        <Corner className="right-3 top-3 rotate-90 md:right-4 md:top-4" />

        <div className="flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => handleClick(e, "#top")}
            className="relative flex items-center pb-1"
            aria-label="heysayeed.dev — home"
            data-cursor="link"
          >
            <TypingLogo />
          </a>

          <nav className="flex items-center gap-4 md:gap-8">
            {/* Desktop links */}
            <div className="hidden items-center gap-6 md:flex md:gap-8">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  data-cursor="link"
                  className="font-mono text-[12px] tracking-[-0.02em] text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-cursor="link"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 md:hidden"
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </nav>
        </div>
      </header>

      {/* ── Mobile overlay menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[8500] flex flex-col bg-black"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Corner brackets to match the navbar HUD */}
            <Corner className="left-3 top-3" />
            <Corner className="right-3 top-3 rotate-90" />

            {/* Menu links */}
            <nav className="flex flex-1 flex-col justify-center px-8">
              {LINKS.map((link, i) => (
                <div key={link.label} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    data-cursor="link"
                    className="group flex items-baseline gap-4 py-3"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{
                      delay: 0.15 + i * 0.07,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="font-mono text-[11px] text-white/30">
                      0{i + 1}
                    </span>
                    <span className="font-body text-[clamp(2.5rem,10vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.03em] text-white uppercase transition-colors group-hover:text-white/60">
                      {link.label}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Footer meta inside the menu */}
            <motion.div
              className="flex items-center justify-between border-t border-white/[0.08] px-8 py-5 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span>heysayeed.dev</span>
              <span>portfolio — 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
