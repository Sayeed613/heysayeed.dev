import { useState, useEffect, type RefObject } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  return (
    <span className="tabular-nums text-text-muted/60 text-[11px] font-mono font-medium leading-none tracking-wide">
      {hh}:{mm}:{ss}
    </span>
  );
}

interface ChromeBarProps {
  sayeedIdleRef?: RefObject<HTMLDivElement | null>;
}

export default function ChromeBar({ sayeedIdleRef }: ChromeBarProps) {
  const progress = useScrollProgress();
  const [active, setActive] = useState("Home");

  return (
    <header
      id="chrome-bar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-[38px] px-4 select-none"
      style={{
        background: "#0A0A0A",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* ─── Left: status dot + logo ─── */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span
          className="w-[6px] h-[6px] rounded-full bg-accent status-dot"
          style={{ boxShadow: "0 0 6px rgba(220,38,38,0.6)" }}
        />
        <span
          className="text-[11px] font-mono font-medium leading-none tracking-[0.06em]"
          style={{ color: "#9CA3AF" }}
        >
          heysayeed.dev
        </span>
      </div>

      {/* ─── Center: nav links ─── */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-0.5 px-2 py-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setActive(link.label);
              }}
              className={`group relative px-3 py-1 text-[11px] font-mono leading-none rounded-full transition-all duration-300 overflow-hidden ${
                active === link.label
                  ? "text-accent drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {/* Text roll-up */}
              <span className="relative inline-flex flex-col overflow-hidden h-[11px]">
                <span className="flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-full">
                  {link.label}
                </span>
                <span className="flex items-center justify-center transition-transform duration-200 translate-y-0 group-hover:-translate-y-full">
                  {link.label}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── Right: status + clock + Sayeed idle ─── */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-mono leading-none font-medium" id="build-status">
          <span className="text-accent/70">build: passing</span>
        </span>

        <LiveClock />

        {/* Sayeed idle position marker */}
        <div
          ref={sayeedIdleRef}
          className="relative w-[2px] h-[2px] ml-1"
          aria-hidden="true"
        />
      </div>

      {/* ─── Bottom glow progress bar ─── */}
      <div
        className="absolute bottom-0 left-0 h-[2px] pointer-events-none"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, rgba(220,38,38,0.3), #DC2626 30%, #EF4444 60%, rgba(239,68,68,0.6))",
          boxShadow: "0 0 8px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.15)",
          transition: "width 60ms linear",
        }}
      />
    </header>
  );
}
