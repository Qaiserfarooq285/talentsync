import { stats } from "@/lib/content";
import CountUp from "./CountUp";

export default function StatStrip() {
  return (
    <div
      className="bg-brand-blue-ink px-5 md:px-8 lg:px-10"
      style={{ paddingTop: "var(--hero-stat-py)", paddingBottom: "var(--hero-stat-py)" }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-x-4 gap-y-3 sm:gap-y-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`min-w-0 px-1 text-center md:border-r md:border-white/10 md:px-8 md:text-left ${
              i === stats.length - 1 ? "md:border-r-0" : ""
            } ${i === 0 ? "md:pl-0" : ""}`}
          >
            <div className="whitespace-nowrap text-[clamp(21px,4.5vw,38px)] font-bold tracking-[-.02em] text-white">
              <CountUp value={stat.value} />
            </div>
            <div className="mt-1 text-[11px] leading-snug text-white/60 sm:mt-2 sm:text-[12px] md:text-[13px]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
