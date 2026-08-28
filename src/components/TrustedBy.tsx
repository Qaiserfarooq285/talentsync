import Reveal from "./Reveal";
import { clients, networkParagraphs } from "@/lib/content";

export default function TrustedBy() {
  return (
    <section className="bg-brand-blue-ink px-5 py-14 md:px-14 md:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <Reveal>
            <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange-light">
              Trusted By Leading Companies
            </span>
            <h2 className="mt-3.5 text-[clamp(24px,3vw,36px)] font-bold text-white">
              Our Growing Network
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {networkParagraphs.map((p) => (
                <p key={p} className="text-[15.5px] leading-[1.68] text-white/70">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded border border-white/12 bg-white/12 sm:grid-cols-4">
              {clients.slice(0, 8).map((client) => (
                <div
                  key={client.name}
                  className="flex flex-col items-center justify-center gap-2 bg-brand-blue-ink p-4 text-center transition-colors duration-150 hover:bg-white/[.06] md:p-[20px_14px]"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white transition-transform duration-150 hover:scale-110"
                    style={{ background: client.color }}
                    aria-hidden
                  >
                    {client.initials}
                  </span>
                  <span className="text-[13.5px] font-semibold leading-tight text-white/86">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="group relative overflow-hidden rounded border border-white/12 py-5">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-blue-ink to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-blue-ink to-transparent"
              aria-hidden
            />
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[...clients, ...clients].map((client, i) => (
                <div key={`${client.name}-${i}`} className="flex shrink-0 items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: client.color }}
                    aria-hidden
                  >
                    {client.initials}
                  </span>
                  <span className="whitespace-nowrap text-[13.5px] font-semibold text-white/70">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
