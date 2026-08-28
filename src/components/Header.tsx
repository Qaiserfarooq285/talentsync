"use client";

import Image from "next/image";
import { useState } from "react";
import { contact, nav } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-orange-light">
      <path
        d="M12 22s7-6.5 7-12.5a7 7 0 1 0-14 0C5 15.5 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-orange-light">
      <path
        d="M4.5 4.5h3.6l1.6 4.4-2.1 1.7a12.5 12.5 0 0 0 5.8 5.8l1.7-2.1 4.4 1.6v3.6c0 1-.8 1.8-1.8 1.7C9.9 20.6 3.4 14.1 2.8 6.3c-.1-1 .7-1.8 1.7-1.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-orange-light">
      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 text-brand-orange dark:text-brand-orange-light ${className}`}
    >
      <path
        d="M12 3.5v11.5m0 0 4.5-4.5M12 15 7.5 10.5M4.5 18.5h15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden md:block bg-brand-blue-deep px-8 py-[10px] text-[12.5px] text-white/78 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-1.5">
            <span className="flex items-center gap-[7px] whitespace-nowrap">
              <PinIcon />
              {contact.location}
            </span>
            <span className="flex items-center gap-[7px] whitespace-nowrap">
              <PhoneIcon />
              {contact.phone}
            </span>
            <span className="flex items-center gap-[7px] whitespace-nowrap">
              <MailIcon />
              {contact.email}
            </span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange" />
            </span>
            <span>{contact.availability}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-surface px-5 py-2.5 md:px-8 md:py-3 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
          <a href="#top" className="flex shrink-0 items-center">
            <Image
              src="/images/talentsync-logo.png"
              alt="TalentSync Manpower Services"
              width={200}
              height={46}
              className="h-[30px] w-auto md:h-[42px]"
              priority
            />
          </a>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[14.5px] font-medium text-text-strong transition-colors hover:text-text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex shrink-0 items-center gap-3">
            <a
              href="/TalentSync_Company_Profile_Updated.docx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[7px] whitespace-nowrap rounded-[3px] border border-brand-orange/40 bg-brand-orange/10 px-[11px] py-[7px] text-[11px] font-semibold uppercase tracking-[.08em] text-brand-orange-hover transition-colors hover:bg-brand-orange/20 dark:text-brand-orange-light"
            >
              <DownloadIcon />
              Company Profile · {contact.location}
            </a>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1"
            >
              <span
                className={`h-[1.5px] w-5 bg-text-strong transition-transform ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span className={`h-[1.5px] w-5 bg-text-strong transition-opacity ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-[1.5px] w-5 bg-text-strong transition-transform ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4 lg:hidden">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-11 py-2.5 text-[15px] font-medium text-text-strong"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a
                href="/TalentSync_Company_Profile_Updated.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center gap-[7px] rounded border border-brand-orange/40 bg-brand-orange/10 px-[18px] py-[10px] text-center text-sm font-semibold text-brand-orange-hover dark:text-brand-orange-light"
              >
                <DownloadIcon />
                Company Profile
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="min-h-11 rounded bg-brand-orange px-5 py-[11px] text-center text-sm font-semibold text-white"
              >
                Request manpower
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
