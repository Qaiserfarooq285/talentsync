import Image from "next/image";
import { contact, footerLinks, tagline } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-brand-navy-900 px-5 pb-7 pt-14 md:px-14 md:pb-7 md:pt-14">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/12 pb-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-11">
          <div>
            <div className="inline-flex rounded bg-white px-3.5 py-2.5">
              <Image
                src="/images/talentsync-logo.png"
                alt="TalentSync Manpower Services"
                width={140}
                height={34}
                className="h-[34px] w-auto"
              />
            </div>
            <p className="mt-4 max-w-[320px] text-[14.5px] leading-[1.65] text-white/58">
              {tagline}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[.1em] text-white/45">
              Services
            </div>
            <div className="mt-4 flex flex-col gap-[11px] text-sm">
              {footerLinks.services.map((label) => (
                <a key={label} href="#services" className="text-white/80 hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[.1em] text-white/45">
              Company
            </div>
            <div className="mt-4 flex flex-col gap-[11px] text-sm">
              {footerLinks.company.map((item) => (
                <a key={item.href} href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[.1em] text-white/45">
              Contact
            </div>
            <div className="mt-4 flex flex-col gap-[11px] text-sm text-white/80">
              <span>{contact.location}</span>
              <span>{contact.phone}</span>
              <span>{contact.email}</span>
              <span className="text-brand-orange-light">Available 24/7</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-[22px] text-[12.5px] text-white/42 sm:flex-row sm:justify-between">
          <span>TalentSync Manpower Services · Fujairah, UAE · Your People, Our Priority</span>
          <span>© 2026 TalentSync Manpower Services</span>
        </div>
      </div>
    </footer>
  );
}
