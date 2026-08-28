import Image from "next/image";
import StatStrip from "./StatStrip";
import TypewriterWords from "./TypewriterWords";

const trustedNames = ["Cevahir", "Descon", "Trojan", "Daewoo E&C Iraq", "Khalifa Holding"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-blue-deep">
      {/* Photo band — height is capped per breakpoint (and further capped on short windows) so the crop never over-zooms */}
      <div className="relative" style={{ height: "var(--hero-band-h)" }}>
        <Image
          src="/images/hero-bg-2.png"
          alt="The full range of manpower TalentSync deploys — operators, engineers, technical staff and skilled tradesmen on site"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_18%] sm:object-[center_22%] lg:object-[center_28%]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(11,32,55,.92) 0%, rgba(11,32,55,.72) 34%, rgba(11,60,116,.42) 62%, rgba(11,60,116,.18) 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(180deg, transparent, var(--color-brand-blue-deep))" }}
          aria-hidden
        />
      </div>

      <div
        className="relative px-5 pb-3 sm:pb-6 md:px-14"
        style={{ marginTop: "calc(-1 * var(--hero-overlap))" }}
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-[640px]" style={{ paddingTop: "var(--hero-pt-inner)" }}>
            <h1 className="text-[clamp(24px,4.4vw,54px)] font-bold leading-[1.1] tracking-[-.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.45)]">
              Your Trusted Partner for{" "}
              <span className="text-brand-orange-light">Skilled Manpower Solutions</span>{" "}
              <span className="whitespace-nowrap">
                Across{" "}
                <TypewriterWords words={["Africa", "GCC", "& Beyond"]} className="text-brand-orange-light" />
              </span>
            </h1>

            <p
              className="max-w-[540px] text-[13.5px] leading-[1.5] text-white/85 sm:text-[15px] md:text-base"
              style={{ marginTop: "var(--hero-gap-p)" }}
            >
              Over 10,000 Manpower Supplied Across 9 Industries. Skilled, semi-skilled and
              professional workforce for construction, oil &amp; gas, engineering and industrial
              projects.
            </p>

            <div
              className="flex flex-col gap-2.5 sm:flex-row sm:gap-3"
              style={{ marginTop: "var(--hero-gap-btns)" }}
            >
              <a
                href="#contact"
                className="min-h-11 rounded bg-brand-orange px-6 py-3 text-center text-[14px] font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_8px_20px_rgba(245,117,26,.35)] sm:py-3.5 sm:text-[15px] md:text-base"
              >
                Request manpower
              </a>
              <a
                href="#contact"
                className="min-h-11 rounded border border-white/50 bg-white/5 px-6 py-3 text-center text-[14px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:py-3.5 sm:text-[15px] md:text-base"
              >
                Talk to our team
              </a>
            </div>

            <div
              className="border-t border-white/20"
              style={{ marginTop: "var(--hero-gap-trust)", paddingTop: "var(--hero-gap-trust-pt)" }}
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-[.08em] text-white/60 sm:text-[11px]">
                Trusted by
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 sm:mt-2.5 sm:gap-x-6 sm:gap-y-2">
                {trustedNames.map((name) => (
                  <span
                    key={name}
                    className="text-[12.5px] font-semibold text-white/85 transition-colors hover:text-white sm:text-[13.5px]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-1 sm:mt-2 md:mt-3">
        <StatStrip />
      </div>
    </section>
  );
}
