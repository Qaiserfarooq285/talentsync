import Reveal from "./Reveal";
import { getStartedSteps } from "@/lib/content";

const badgeColor: Record<string, string> = {
  "brand-orange": "#F5751A",
  "brand-blue": "#1266C4",
  "brand-blue-deep": "#0B3C74",
};

export default function GetStarted() {
  return (
    <section className="border-t border-border bg-surface-alt px-5 py-12 md:px-14 md:py-[70px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <h3 className="text-2xl font-bold text-text-primary md:text-[30px]">How to Get Started</h3>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {getStartedSteps.map((step) => (
            <Reveal key={step.number}>
              <div className="flex h-full items-start gap-[18px] rounded-[5px] border border-border bg-surface p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(11,60,116,.10)] md:p-[28px_26px]">
                <span
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white"
                  style={{ background: badgeColor[step.color] }}
                >
                  {step.number}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-text-primary">{step.title}</h4>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
