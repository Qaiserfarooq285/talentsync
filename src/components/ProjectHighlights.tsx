import Reveal from "./Reveal";
import { projectHighlights } from "@/lib/content";

export default function ProjectHighlights() {
  return (
    <section id="projects" className="bg-surface px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-[640px]">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
            Recent Project Highlights
          </span>
          <h2 className="mt-3.5 text-[clamp(24px,3.2vw,42px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
            Mobilisations delivered on the date they were promised
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-px overflow-hidden rounded-[5px] border border-border bg-border">
          {projectHighlights.map((item) => (
            <Reveal key={item.label}>
              <div className="h-full bg-surface p-6 transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(11,60,116,.10)] md:p-[32px_30px]">
                <div className="text-[12px] font-bold uppercase tracking-[.09em] text-brand-blue dark:text-[#6db3ff]">
                  {item.label}
                </div>
                <p className="mt-3 text-[15.5px] leading-[1.66] text-text-body">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
