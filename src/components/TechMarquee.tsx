/**
 * TechMarquee — infinite horizontal scroll of monochrome tech logos.
 * Uses the same CSS marquee animation as the text Marquee, but with
 * SVG icons instead of text. Two rows scrolling in opposite directions
 * for visual depth.
 */

const TECH = [
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 17V11M9 14H15M8 8C8 8 10 7 12 7C14 7 15.5 8 15.5 9.5C15.5 11 13 11.5 13 11.5" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 15V9L15 15" />
      </svg>
    ),
  },
  {
    name: "Three.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
        <path d="M2 17L12 22L22 17" />
        <path d="M2 12L12 17L22 12" />
      </svg>
    ),
  },
  {
    name: "GSAP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6L12 12L4 18" />
        <path d="M12 6L20 12L12 18" />
      </svg>
    ),
  },
  {
    name: "Framer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3H19V9H12L5 3Z" />
        <path d="M5 9H12L19 15H5V9Z" />
        <path d="M5 15H12L5 21V15Z" />
      </svg>
    ),
  },
  {
    name: "Tailwind",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6C8 10 10 12 14 12C18 12 20 10 20 8C20 6 18 4 14 4C10 4 8 6 6 10" />
        <path d="M4 18C6 22 8 22 12 22C16 22 18 20 18 18C18 16 16 14 12 14C8 14 6 16 4 20" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" />
        <path d="M12 22V12" />
        <path d="M21 7L12 12L3 7" />
      </svg>
    ),
  },
  {
    name: "WebGL",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" strokeDasharray="3 5" />
        <circle cx="12" cy="12" r="5" />
        <path d="M12 3V7M12 17V21M3 12H7M17 12H21" />
      </svg>
    ),
  },
  {
    name: "GLSL",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4L4 8L8 12" />
        <path d="M16 4L20 8L16 12" />
        <path d="M14 4L10 12" />
      </svg>
    ),
  },
  {
    name: "Figma",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="3" width="4" height="5" rx="2" />
        <rect x="14" y="3" width="4" height="5" rx="2" />
        <rect x="8" y="9" width="4" height="5" rx="2" />
        <rect x="8" y="15" width="4" height="5" rx="2" />
        <circle cx="18" cy="11.5" r="2.5" />
      </svg>
    ),
  },
  {
    name: "Storybook",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4H20V20H4V4Z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 16H15" />
      </svg>
    ),
  },
];

function LogoRow({ items, reverse = false }: { items: typeof TECH; reverse?: boolean }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-3">
      <div
        className="marquee-track"
        style={{
          animationDuration: reverse ? "45s" : "40s",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {Array.from({ length: 3 }).map((_, setIdx) => (
          <span key={setIdx} className="inline-flex items-center">
            {items.map((tech, i) => (
              <span
                key={`${setIdx}-${i}`}
                className="inline-flex items-center gap-2 px-8 text-white/[0.30] transition-colors duration-300 hover:text-white/70"
              >
                <span className="h-7 w-7">{tech.icon}</span>
                <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
                  {tech.name}
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className="mt-16 border-t border-white/[0.06] pt-8">
      <LogoRow items={TECH} />
      <LogoRow items={[...TECH].reverse()} reverse />
    </div>
  );
}
