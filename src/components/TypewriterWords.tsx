"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED = 90;
const DELETE_SPEED = 45;
const HOLD_MS = 1100;
const GAP_MS = 350;

export default function TypewriterWords({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const [text, setText] = useState("");
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reserve the width of the longest word so the headline's line breaks never
  // shift while the text types in and deletes out.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    if (reducedMotion) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wordIndex];

      if (!deleting) {
        charIndex += 1;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timeoutId = setTimeout(tick, HOLD_MS);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex -= 1;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeoutId = setTimeout(tick, GAP_MS);
          return;
        }
        timeoutId = setTimeout(tick, DELETE_SPEED);
      }
    };

    timeoutId = setTimeout(tick, TYPE_SPEED);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reducedMotion) {
    return <span className={className}>{longest}</span>;
  }

  return (
    <span className={`${className} inline-grid whitespace-nowrap`}>
      {/* Invisible sizer: holds the full width of the longest word at all times. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {longest}
      </span>
      <span className="col-start-1 row-start-1 justify-self-start" aria-label={longest}>
        {text}
        <span
          className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle"
          style={{ height: "0.85em" }}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
