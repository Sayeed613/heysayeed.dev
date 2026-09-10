import { useEffect, useState } from "react";
import ZoomTextTunnel from "./originkit/ui/infinite-text-passage";

const WORDS = ["DESIGN", "BUILD", "SHIP"];
const HOLD = 350;
const ZOOM_MS = 1200;
// Swap k fires at HOLD + (k-1)*(HOLD+ZOOM); last word (SHIP) enters on
// swap N-1 and finishes zooming ZOOM ms later.
const EXIT_AT =
  WORDS.length === 1
    ? ZOOM_MS
    : HOLD + (WORDS.length - 2) * (HOLD + ZOOM_MS) + ZOOM_MS;
// Small buffer so timer/animation drift never clips the final zoom —
// still inside the 350ms hold before the tunnel would loop.
const EXIT_BUFFER = 300;
const EXIT_MS = EXIT_AT + EXIT_BUFFER;
const CURTAIN_MS = 800;

/**
 * Full-screen intro loader built on Originkit's Infinite Text Passage.
 * DESIGN → BUILD → SHIP zoom past tunnel-style, then the whole panel
 * wipes upward as a page transition, revealing the section beneath.
 */
export default function Loader({ onDone }: { onDone?: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Curtain starts exactly as SHIP finishes zooming in
    const exitTimer = setTimeout(() => {
      setLeaving(true);
      onDone?.(); // mount the page beneath while the curtain lifts
    }, EXIT_MS);

    const doneTimer = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, EXIT_MS + CURTAIN_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black will-change-transform"
      style={{
        transform: leaving ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${CURTAIN_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      }}
    >
      {/* Freeze on SHIP once the curtain starts lifting — no loop back */}
      {!leaving && (
        <div className="absolute inset-0">
          <ZoomTextTunnel
            texts={WORDS}
            hold={HOLD}
            maxScale={30}
            font={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontWeight: 500,
              /* Responsive: fits word width on phones (17vw), while wide
                 screens keep the original 22vh exactly. */
              fontSize: "clamp(2.75rem, min(17vw, 22vh), 22vh)" as unknown as number,
              lineHeight: "1em",
              letterSpacing: "-0.03em",
              textAlign: "center",
            }}
            color="#FFFFFF"
          />
        </div>
      )}

      {/* Progress hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <span className="font-mono text-[11px] tracking-[0.25em] text-white/30 uppercase">
          heysayeed.dev
        </span>
      </div>
    </div>
  );
}
