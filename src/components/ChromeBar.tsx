import { useState, useEffect, type RefObject } from "react";

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

function CursorGlow({ progress }: { progress: number }) {
  return (
    <div
      className="absolute bottom-0 pointer-events-none transition-none"
      style={{
        left: 0,
        width: `${progress}%`,
        height: "100%",
        background: "linear-gradient(90deg, rgba(34,211,238,0.12) 0%, transparent 100%)",
      }}
    />
  );
}

function ScaleLabels() {
  const marks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none">
      {marks.map((m) => (
        <span
          key={m}
          className="absolute top-[2px] -translate-x-1/2 text-[9px] font-mono font-medium leading-none tracking-wide"
          style={{ left: `${m}%`, color: "#6b7280" }}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

function ScrollCursor({ progress }: { progress: number }) {
  const pct = String(Math.round(progress)).padStart(2, "0");
  return (
    <>
      {/* Blue cursor line — positioned independently at exact progress% */}
      <div
        className="absolute bottom-0 pointer-events-none transition-none"
        style={{
          left: `${progress}%`,
          transform: "translateX(-50%)",
          height: "18px",
        }}
      >
        <span
          className="block w-[1.5px] h-full rounded-full"
          style={{
            background: "#22D3EE",
            boxShadow: "0 0 5px rgba(34,211,238,0.7), 0 0 2px rgba(34,211,238,0.4)",
          }}
        />
      </div>
      {/* Percentage label — positioned separately, offset right of the line */}
      <span
        className="absolute bottom-0 pointer-events-none transition-none text-[10px] font-mono font-medium leading-none tracking-wide mb-[2px]"
        style={{
          left: `calc(${progress}% + 10px)`,
          color: "#22D3EE",
        }}
      >
        {pct}%
      </span>
    </>
  );
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
    <span className="tabular-nums text-[#6b7280] text-[11px] font-mono font-medium leading-none tracking-wide">
      {hh}:{mm}:{ss}
    </span>
  );
}

function ScannerBars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="scanner-bar"
          style={{
            left: `${10 + i * 20}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${7 + i * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}

interface ChromeBarProps {
  sayeedIdleRef?: RefObject<HTMLDivElement | null>;
}

export default function ChromeBar({ sayeedIdleRef }: ChromeBarProps) {
  const progress = useScrollProgress();

  return (
    <header
      id="chrome-bar"
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-[36px] px-3 select-none"
      style={{
        background: "#0C1016",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ─── Left: status dot + logo + text ─── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Logo mark */}
        <img
          src="../../public/logo.png"
          alt="logo"
          className="h-[14px] w-auto shrink-0"
        />
        <span
          className="text-[11px] font-mono font-medium leading-none tracking-[0.08em]"
          style={{ color: "#8B93A7" }}
        >
          heysayeed.dev
        </span>
      </div>

      {/* ─── Center: tick ruler + scanner + scroll cursor ─── */}
      <div className="flex-1 relative h-full mx-6 ">
        <CursorGlow progress={progress} />
        <ScaleLabels />
        <div
          className="absolute inset-x-0"
          style={{
            bottom: 0,
            height: 24,
            overflow: "hidden",
            backgroundImage: [
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 20px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 4px)",
            ].join(","),
            backgroundSize: "100% 12px, 100% 6px",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "bottom, bottom",
          }}
        />
        <ScannerBars />
        <ScrollCursor progress={progress} />
      </div>

      {/* ─── Right: build status + clock + Sayeed idle ─── */}
      <div className="flex items-center gap-3 shrink-0" id="build-status">
        <span className="flex items-center gap-1.5 text-[11px] font-mono leading-none font-medium">
          <span
            className="w-2 h-2 rounded-full bg-accent status-dot"
            style={{ boxShadow: "0 0 6px rgba(34,211,238,0.6)" }}
          />
          <span className="text-accent">build: passing ✓</span>
        </span>
        <LiveClock />

        {/* Sayeed idle position marker */}
        <div
          ref={sayeedIdleRef}
          className="relative w-[2px] h-[2px] ml-1"
          aria-hidden="true"
        />
      </div>
    </header>
  );
}
