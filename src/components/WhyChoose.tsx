import Reveal from "./Reveal";
import { whyChoose } from "@/lib/content";

export default function WhyChoose() {
  return (
    <section id="why-choose" className="bg-surface px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-[600px]">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
            Why Choose TalentSync?
          </span>
          <h2 className="mt-3.5 text-[clamp(24px,3.4vw,42px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
            Six reasons clients keep coming back
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-9">
          {whyChoose.map((item, i) => (
            <Reveal key={item.title}>
              <div
                className="group pt-5 transition-[border-color] duration-150"
                style={{ borderTop: `2px solid ${i === 0 ? "#F5751A" : "var(--color-border)"}` }}
              >
                <h4 className="text-[19px] font-bold text-text-primary transition-colors group-hover:text-brand-blue-deep dark:text-brand-blue">
                  {item.title}
                </h4>
                <p className="mt-2 text-[15px] leading-[1.64] text-text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
