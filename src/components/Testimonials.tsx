import Reveal from "./Reveal";
import { testimonials, testimonialsNote } from "@/lib/content";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#F5751A" : "none"}>
      <path
        d="m12 2.5 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.7l-6.1 3.2 1.5-6.8-5.2-4.6 6.9-.7L12 2.5Z"
        stroke="#F5751A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-surface-alt px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-[640px]">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
            Client Reviews
          </span>
          <h2 className="mt-3.5 text-[clamp(24px,3.2vw,42px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
            What clients say about working with us
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {testimonials.map((t) => (
            <Reveal key={t.name + t.role}>
              <div className="flex h-full flex-col rounded-[5px] border border-border bg-surface p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(11,60,116,.10)]">
                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < t.rating} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-[14.5px] leading-[1.6] text-text-body">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  <div className="text-[14px] font-semibold text-text-primary">{t.name}</div>
                  <div className="mt-0.5 text-[12.5px] text-text-subtle-2">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] text-text-subtle-2">{testimonialsNote}</p>
      </div>
    </section>
  );
}
