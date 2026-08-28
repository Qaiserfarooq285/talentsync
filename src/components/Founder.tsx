import Reveal from "./Reveal";
import { founder } from "@/lib/content";

export default function Founder() {
  return (
    <section id="founder" className="bg-surface px-5 py-10 md:px-14 md:py-14">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="grid gap-6 rounded-[5px] border border-border bg-surface-alt p-5 transition-shadow duration-150 hover:shadow-[0_8px_28px_rgba(11,60,116,.08)] md:grid-cols-[160px_1fr] md:gap-8 md:p-7">
            <div className="mx-auto flex h-[130px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface ring-1 ring-border md:mx-0 md:h-[150px] md:w-[150px]">
              <div className="flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(45deg,#eef2f7,#eef2f7_8px,#e4e9ef_8px,#e4e9ef_16px)]">
                <span className="px-4 text-center text-[10px] font-medium text-text-subtle">
                  Photo placeholder — headshot
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
                Leadership
              </span>
              <h2 className="mt-2 text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-.02em] text-text-primary">
                {founder.name}
              </h2>
              <div className="mt-0.5 text-[13.5px] font-semibold text-brand-blue dark:text-[#6db3ff]">
                {founder.title}
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                {founder.bio.map((p) => (
                  <p key={p} className="text-[13.5px] leading-[1.6] text-text-body">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-text-strong">
                <a href={`mailto:${founder.email}`} className="hover:text-brand-blue dark:text-[#6db3ff]">
                  {founder.email}
                </a>
                <a href={`tel:${founder.phone.replace(/\s/g, "")}`} className="hover:text-brand-blue dark:text-[#6db3ff]">
                  {founder.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
