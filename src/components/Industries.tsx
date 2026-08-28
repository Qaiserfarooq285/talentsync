import Image from "next/image";
import Reveal from "./Reveal";
import { industries } from "@/lib/content";

export default function Industries() {
  return (
    <section id="industries" className="bg-surface px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-[800px]">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
            Industries We Serve
          </span>
          <h2 className="mt-3.5 text-[clamp(26px,3.4vw,42px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
            Nine major industries, one reliable partner
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-text-body md:text-[16.5px]">
            TalentSync supplies manpower across nine major industries, giving clients a single,
            reliable partner for workforce needs spanning construction, energy, and industrial
            operations.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] md:gap-4">
          {industries.map((industry) => (
            <Reveal key={industry.name}>
              <div className="group relative h-[104px] overflow-hidden rounded md:h-[210px]">
                <Image
                  src={industry.image}
                  alt={industry.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-8 text-[13px] font-bold text-white md:px-5 md:pb-[18px] md:pt-[52px] md:text-lg"
                  style={{
                    background: "linear-gradient(transparent, rgba(11,32,55,.92))",
                  }}
                >
                  {industry.name}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
