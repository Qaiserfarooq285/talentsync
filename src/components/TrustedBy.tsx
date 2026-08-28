import Image from "next/image";
import Reveal from "./Reveal";
import { clients, networkParagraphs, type Client } from "@/lib/content";

function ClientChip({ client }: { client: Client }) {
  return (
    <div className="flex h-[74px] items-center justify-center rounded bg-white px-4 transition-transform duration-150 hover:-translate-y-0.5">
      {client.logo ? (
        <Image
          src={client.logo}
          alt={`${client.name} logo`}
          width={120}
          height={44}
          className="max-h-[44px] w-auto object-contain"
        />
      ) : (
        <span className="text-center text-[13px] font-bold leading-tight text-brand-blue-ink">
          {client.name}
        </span>
      )}
    </div>
  );
}

export default function TrustedBy() {
  const marqueeClients = clients.filter((c) => c.logo);

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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {clients.slice(0, 9).map((client) => (
                <ClientChip key={client.name} client={client} />
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="group relative overflow-hidden py-2">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-blue-ink to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-blue-ink to-transparent"
              aria-hidden
            />
            <div className="flex w-max animate-[marquee_36s_linear_infinite] gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[...marqueeClients, ...marqueeClients].map((client, i) => (
                <div key={`${client.name}-${i}`} className="w-[150px] shrink-0">
                  <ClientChip client={client} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
