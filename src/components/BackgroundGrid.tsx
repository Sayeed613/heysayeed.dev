import { useEffect, useRef } from "react";

export default function BackgroundGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let offset = 0;
    let hidden = false;

    function animate() {
      if (!hidden) {
        offset += 0.08;
        if (gridRef.current) {
          gridRef.current.style.backgroundPosition = `${offset}px ${offset * 0.7}px`;
        }
      }
      frame = requestAnimationFrame(animate);
    }

    function onVisibility() {
      hidden = document.hidden;
      if (hidden) {
        cancelAnimationFrame(frame);
      } else {
        frame = requestAnimationFrame(animate);
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: [
          /* Dot grid — subtle dots at the intersections */
          "radial-gradient(circle, rgba(220,38,38,0.2) 0.8px, transparent 0.8px)",
        ].join(","),
        backgroundSize: "32px 32px",
        backgroundPosition: "0px 0px",
      }}
      aria-hidden="true"
    />
  );
}
