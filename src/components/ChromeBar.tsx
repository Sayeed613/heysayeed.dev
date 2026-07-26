import { useState, useEffect } from "react";

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
    <span className="tabular-nums text-text-muted text-[11px] font-mono leading-none tracking-wide">
      {hh}
      <span className="text-text-muted">:</span>
      {mm}
      <span className="text-text-muted">:</span>
      {ss}
    </span>
  );
}

function LineTicks() {
  const ticks = Array.from({ length: 40 }, (_, i) => (
    <span
      key={i}
      className="block w-[1px]"
      style={{ height: i % 5 === 0 ? 12 : 6, background: "var(--color-border-subtle)" }}
    />
  ));

  return <div className="flex items-end gap-[5px] h-full">{ticks}</div>;
}

export default function ChromeBar() {
  return (
    <header id="chrome-bar" className="fixed top-0 left-0 right-0 z-50 flex items-center h-[36px] bg-editor-bg border-b border-border-subtle px-3 select-none">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-3 h-3 rounded-full bg-accent" />
        <span className="text-text-muted text-[11px] font-mono font-medium tracking-wide uppercase leading-none">
          heysayeed.dev
        </span>
      </div>

      {/* Center: Line ticks */}
      <div className="flex-1 flex items-end justify-center h-full overflow-hidden px-6">
        <LineTicks />
      </div>

      {/* Right: Build status + clock */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-mono leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-accent">build: passing ✓</span>
        </span>
        <LiveClock />
      </div>
    </header>
  );
}
