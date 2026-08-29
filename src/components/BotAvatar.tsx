/** The assistant's face — brand navy shell, orange visor and antenna. */
export default function BotAvatar({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* antenna */}
      <circle cx="22" cy="5.5" r="3.2" fill="var(--color-brand-orange)" />
      <rect x="20.8" y="7.5" width="2.4" height="4.6" rx="1.2" fill="var(--color-brand-orange)" />

      {/* head */}
      <rect
        x="5.5"
        y="11.5"
        width="33"
        height="26"
        rx="9"
        fill="var(--color-brand-blue-deep)"
      />

      {/* ears */}
      <rect x="1.6" y="19" width="4" height="10" rx="2" fill="var(--color-brand-orange)" />
      <rect x="38.4" y="19" width="4" height="10" rx="2" fill="var(--color-brand-orange)" />

      {/* visor */}
      <rect x="10" y="16.5" width="24" height="16" rx="7" fill="var(--color-brand-blue-ink)" />

      {/* eyes */}
      <circle cx="17.2" cy="24.2" r="2.9" fill="var(--color-brand-orange-light)" />
      <circle cx="26.8" cy="24.2" r="2.9" fill="var(--color-brand-orange-light)" />

      {/* smile */}
      <path
        d="M18.4 29.4c1.1.9 2.2 1.3 3.6 1.3s2.5-.4 3.6-1.3"
        stroke="var(--color-brand-orange-light)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  );
}

/** A waving hand, used beside the greeting. */
export function WavingHand({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block animate-wave ${className}`} aria-hidden="true">
      👋
    </span>
  );
}
