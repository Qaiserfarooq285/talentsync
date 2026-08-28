"use client";

import { useEffect, useRef, useState } from "react";

function parseValue(raw: string) {
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return { number: 0, suffix: raw };
  return { number: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] };
}

export default function CountUp({
  value,
  duration = 1400,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const { number, suffix } = parseValue(value);
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [display, setDisplay] = useState(reducedMotion ? value : `0${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const finalValue = `${number.toLocaleString("en-US")}${suffix}`;
    let frameId: number | undefined;
    let settleId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(number * eased);
          setDisplay(`${current.toLocaleString("en-US")}${suffix}`);
          if (progress < 1) frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        // requestAnimationFrame is paused while a tab is backgrounded, which would
        // otherwise strand the counter on a partial number (e.g. "960+" instead of
        // "10,000+"). This guarantees the real figure is shown regardless.
        settleId = setTimeout(() => setDisplay(finalValue), duration + 150);

        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      if (settleId !== undefined) clearTimeout(settleId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={ref}>{display}</span>;
}
