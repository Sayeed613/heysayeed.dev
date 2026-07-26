export const HEADLINE_TEXT = "Ship fast. Break nothing.";
const HEADLINE_WORDS = HEADLINE_TEXT.split(" ");

export default function HeadlineWords({ showCursor }: { showCursor: boolean }) {
  return (
    <>
      {HEADLINE_WORDS.map((word, i) => (
        <span
          key={i}
          className={`hero-word inline-block ${i === 1 ? "text-accent" : ""}`}
        >
          {word}
          {i < HEADLINE_WORDS.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
      {showCursor && (
        <span className="hero-cursor inline-block text-accent ml-0.5 font-mono font-light">
          |
        </span>
      )}
    </>
  );
}
