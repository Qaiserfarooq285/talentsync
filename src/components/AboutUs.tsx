import Reveal from "./Reveal";
import { aboutParagraphs, coreValues, snapshot, vision, mission } from "@/lib/content";

export default function AboutUs() {
  return (
    <section id="about" className="bg-surface px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
              About Us
            </span>
            <h2 className="mt-3.5 text-[clamp(26px,3.4vw,42px)] font-bold leading-[1.12] tracking-[-.02em] text-text-primary">
              Bridging talented workers with project-driven clients
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {aboutParagraphs.map((p) => (
                <p key={p} className="text-[15.5px] leading-[1.68] text-text-body md:text-[16.5px]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <div className="rounded border border-border border-l-4 border-l-brand-blue p-6 md:p-[26px_28px]">
              <h3 className="text-[19px] font-bold text-text-primary">Our Vision</h3>
              <p className="mt-2 text-[15.5px] leading-[1.65] text-text-body">{vision}</p>
            </div>
            <div className="rounded border border-border border-l-4 border-l-brand-orange p-6 md:p-[26px_28px]">
              <h3 className="text-[19px] font-bold text-text-primary">Our Mission</h3>
              <p className="mt-2 text-[15.5px] leading-[1.65] text-text-body">{mission}</p>
            </div>
            <div className="rounded bg-surface-alt p-6 md:p-[26px_28px]">
              <h3 className="text-[14px] font-bold uppercase tracking-[.05em] text-text-primary">
                Company Snapshot
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-0">
                {snapshot.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex flex-col gap-1 py-2 text-[14.5px] ${
                      i < 4 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="text-text-subtle">{row.label}</span>
                    <span className="font-semibold text-text-strong">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14 md:mt-[62px]">
          <span className="text-[13px] font-bold uppercase tracking-[.13em] text-text-subtle-2">
            Core Values
          </span>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-surface p-6 transition-colors duration-150 hover:bg-surface-alt md:p-[28px_26px]"
              >
                <h4 className="text-lg font-bold text-brand-blue-deep dark:text-brand-blue">{value.title}</h4>
                <p className="mt-2 text-[14.5px] leading-[1.62] text-text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
