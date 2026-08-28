import Reveal from "./Reveal";
import { processSteps, qualityStandards } from "@/lib/content";

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-brand-blue-deep px-5 py-14 md:px-14 md:py-20">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(18,102,196,.45), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px]">
        <Reveal>
          <h2 className="text-[clamp(23px,2.8vw,36px)] font-bold text-white">
            Our Recruitment &amp; Mobilisation Process
          </h2>
        </Reveal>

        <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 md:mt-10 lg:gap-[18px]">
          {processSteps.map((step, i) => (
            <Reveal key={step.number}>
              <div
                className="pt-5"
                style={{
                  borderTop: `2px solid ${i === 0 ? "#F5751A" : "rgba(255,255,255,.28)"}`,
                }}
              >
                <div
                  className="text-[13px] font-bold"
                  style={{ color: i === 0 ? "#F5751A" : "#FFA04D" }}
                >
                  {step.number}
                </div>
                <h4 className="mt-2 text-lg font-bold text-white">{step.title}</h4>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-white/68">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 border-t border-white/16 pt-9 md:mt-[52px] md:pt-[38px]">
          <div className="grid gap-8 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-11">
            <h3 className="text-2xl font-bold text-white">Quality &amp; Compliance Standards</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10 gap-y-5">
              {qualityStandards.map((line) => (
                <div key={line} className="flex gap-3">
                  <span className="mt-2 h-[7px] w-[7px] shrink-0 bg-brand-orange" />
                  <p className="text-[15.5px] leading-[1.6] text-white/78">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
