import Reveal from "./Reveal";
import { africaCountries, gulfCountries, regionalReachBody } from "@/lib/content";

function CountryCard({
  title,
  count,
  countries,
}: {
  title: string;
  count: string;
  countries: { name: string; flag: string }[];
}) {
  return (
    <div className="rounded-[5px] border border-border bg-surface p-6 md:p-[26px_24px]">
      <div className="text-[13px] font-bold uppercase tracking-[.09em] text-brand-blue-deep dark:text-brand-blue">
        {title}
      </div>
      <div className="mt-1 text-[12.5px] text-text-subtle-2">{count}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {countries.map((c) => (
          <span
            key={c.name}
            className="flex items-center gap-[7px] rounded-[3px] border border-border bg-surface-alt px-[11px] py-[6px] text-[13.5px] text-text-strong transition-colors hover:border-brand-blue/40 hover:bg-surface"
          >
            <span className="text-[15px] leading-none">{c.flag}</span>
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegionalReach() {
  return (
    <section id="regional-reach" className="bg-surface-alt px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-[60px]">
          <Reveal>
            <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
              Regional Reach
            </span>
            <h2 className="mt-3.5 text-[clamp(24px,3.2vw,40px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
              12 African nations, 7 Gulf markets
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.6] text-text-body md:text-[16.5px]">
              {regionalReachBody}
            </p>
            <div className="mt-8 rounded-[5px] border border-border bg-surface-alt p-5">
              <div className="mx-auto aspect-[900/760] w-full max-w-[440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/region-map.svg"
                  alt="Map of Africa and the Gulf, with TalentSync's 19 covered countries highlighted in orange against the rest of the region in grey"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-text-subtle-2">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-brand-orange" />
                  Countries we cover
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: "#AEB9C4" }} />
                  Region shown
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-5">
            <CountryCard title="Africa" count="12 countries" countries={africaCountries} />
            <CountryCard title="Gulf / Middle East" count="7 countries" countries={gulfCountries} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
