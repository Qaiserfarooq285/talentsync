import Reveal from "./Reveal";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section id="services" className="bg-surface-alt px-5 py-14 md:px-14 md:py-[86px]">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="max-w-[760px]">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange">
            Our Services
          </span>
          <h2 className="mt-3.5 text-[clamp(26px,3.4vw,42px)] font-bold leading-[1.15] tracking-[-.02em] text-text-primary">
            End-to-end workforce solutions
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.6] text-text-body md:text-[16.5px]">
            TalentSync provides end-to-end workforce solutions tailored to the demands of
            large-scale construction, industrial, and energy projects.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {services.map((service) => (
            <Reveal key={service.number}>
              <div className="h-full rounded-[5px] border border-border bg-surface p-6 transition-all duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-[0_6px_20px_rgba(11,60,116,.10)] md:p-[30px_28px_32px]">
                <div className="text-[13px] font-bold tracking-[.06em] text-brand-orange">
                  {service.number}
                </div>
                <h4 className="mt-4 text-[19px] font-bold text-text-primary">{service.title}</h4>
                <p className="mt-2.5 text-[15px] leading-[1.64] text-text-muted">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
