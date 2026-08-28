import Image from "next/image";
import StatStrip from "./StatStrip";
import TypewriterWords from "./TypewriterWords";

const trustedNames = ["Cevahir", "Descon", "Trojan", "Daewoo E&C Iraq", "Khalifa Holding"];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex flex-col overflow-hidden bg-brand-blue-deep"
      style={{ minHeight: "calc(100dvh - var(--header-h))" }}
    >
      {/*
        The photo is a wide group shot, so a tall narrow crop would only show one
        or two people. On phones it therefore sits as a banner band (near the
        image's own 16:9 ratio, so the whole crew stays visible); from md up it
        becomes a full-bleed background the text floats over.
      */}
      <div className="relative h-[168px] w-full shrink-0 sm:h-[250px] md:absolute md:inset-0 md:h-auto">
        <Image
          src="/images/hero-bg-2.jpg"
          alt="The full range of manpower TalentSync deploys — operators, engineers, technical staff and skilled tradesmen on site"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_28%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,32,55,.35) 0%, rgba(11,32,55,.30) 55%, rgba(11,32,55,.85) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(100deg, rgba(11,32,55,.90) 0%, rgba(11,32,55,.74) 38%, rgba(11,60,116,.48) 68%, rgba(11,60,116,.26) 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Content: below the band on phones, overlaid on the photo from md up. */}
      <div className="relative flex flex-1 items-center px-5 py-5 md:px-14 md:py-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="max-w-[640px]">
            <h1 className="text-[clamp(24px,4.4vw,54px)] font-bold leading-[1.1] tracking-[-.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.45)]">
              Your Trusted Partner for{" "}
              <span className="text-brand-orange-light">Skilled Manpower Solutions</span>{" "}
              <span className="whitespace-nowrap">
                Across{" "}
                <TypewriterWords
                  words={["Africa", "GCC", "& Beyond"]}
                  className="text-brand-orange-light"
                />
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

      <div className="relative">
        <StatStrip />
      </div>
    </section>
  );
}
