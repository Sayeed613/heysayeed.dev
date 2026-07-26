import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
] as const;

export default function FloatingNav() {
  const [active, setActive] = useState("Home");

  return (
    <nav id="floating-nav" className="fixed top-[52px] left-1/2 -translate-x-1/2 z-40 flex items-center w-full max-w-4xl px-4">
      {/* Left metadata */}
      <div className="hidden md:flex items-center gap-2 shrink-0 min-w-[200px]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-text-muted text-[11px] font-mono leading-none tracking-wide">
          available for remote work
        </span>
      </div>

      {/* Nav pill */}
      <div className="flex items-center gap-1 mx-auto px-2 py-1.5 rounded-full bg-[rgba(17,20,28,0.85)] backdrop-blur-md border border-border-subtle shadow-lg shadow-black/20">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              setActive(link.label);
            }}
            className={`relative px-3.5 py-1.5 text-[13px] font-mono leading-none rounded-full transition-all duration-200 ${
              active === link.label
                ? "text-accent bg-accent-dim"
                : "text-text-muted hover:text-text-primary hover:bg-editor-gutter"
            }`}
          >
            {link.label}
          </a>
        ))}

        {/* Divider */}
        <span className="w-px h-4 bg-border-subtle mx-1" />

        {/* Contact CTA — neutral high-contrast fill, not accent */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            setActive("Contact");
          }}
          className={`px-4 py-1.5 text-[13px] font-mono leading-none rounded-full transition-all duration-200 ${
            active === "Contact"
              ? "bg-text-primary text-editor-bg shadow-sm"
              : "bg-text-primary text-editor-bg hover:brightness-110"
          }`}
        >
          Contact
        </a>
      </div>

      {/* Right metadata */}
      <div className="hidden md:flex items-center justify-end shrink-0 min-w-[200px]">
        <span className="text-text-muted text-[11px] font-mono leading-none tracking-wide">
          hey@heysayeed.dev
        </span>
      </div>
    </nav>
  );
}
