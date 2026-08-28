"use client";

import { useState, type FormEvent } from "react";
import { contact, contactIntro } from "@/lib/content";

type Errors = Partial<Record<"name" | "email" | "phone" | "role" | "headcount", string>>;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(formData: FormData): Errors {
    const next: Errors = {};
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const role = String(formData.get("role") || "").trim();
    const headcount = String(formData.get("headcount") || "").trim();

    if (!name) next.name = "Full name is required.";
    if (!email) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (!phone) next.phone = "Phone number is required.";
    if (!role) next.role = "Role / trade required is required.";
    if (!headcount) {
      next.headcount = "Headcount is required.";
    } else if (!/^\d+$/.test(headcount) || Number(headcount) < 1) {
      next.headcount = "Headcount must be a number of 1 or more.";
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validation = validate(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    const form = e.currentTarget;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Surface server-side field errors so the user can correct and retry.
        if (result.errors) setErrors(result.errors);
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "h-[46px] w-full rounded-[3px] border border-border-input bg-surface-input px-3.5 text-[14.5px] text-text-primary outline-none transition-colors focus:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2";
  const labelClass = "text-[12.5px] font-medium text-text-subtle";

  return (
    <section id="contact" className="bg-brand-blue-deep">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="relative overflow-hidden px-5 py-14 md:px-14 md:py-[76px]">
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(245,117,26,.20), transparent 70%)" }}
            aria-hidden
          />
          <div className="relative">
            <span className="text-[11.5px] font-semibold uppercase tracking-[.13em] text-brand-orange-light">
              Get In Touch
            </span>
            <h2 className="mt-3.5 text-[clamp(24px,3.2vw,38px)] font-bold text-white">
              Tell us what your project needs
            </h2>
            <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.66] text-white/76 md:text-[16.5px]">
              {contactIntro}
            </p>

            <div className="mt-9">
              <div className="text-[13px] font-bold uppercase tracking-[.08em] text-white/50">
                TalentSync Manpower Services
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {[contact.location, contact.email, contact.phone, contact.availability].map(
                  (line) => (
                    <div key={line} className="flex items-center gap-3 text-base text-white">
                      <span className="h-1.5 w-1.5 shrink-0 bg-brand-orange" />
                      {line}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="bg-surface px-5 py-12 md:px-14 md:py-[66px]">
          <h3 className="text-xl font-bold text-text-primary md:text-[22px]">Send your requirement</h3>

          {status === "success" ? (
            <div className="mt-6 rounded-[5px] border border-[#c7e6cf] bg-[#f1faf3] p-6 dark:border-[#2a5a3f] dark:bg-[#0f271a]">
              <p className="text-[15px] font-semibold text-[#1d7a3a] dark:text-[#5fd08c]">
                Thanks — your requirement has been received.
              </p>
              <p className="mt-1.5 text-sm text-text-strong">
                Our team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <Field label="Full name" name="name" className={labelClass} inputClass={inputClass} error={errors.name} required />
              <Field label="Company" name="company" className={labelClass} inputClass={inputClass} />
              <Field label="Email" name="email" type="email" className={labelClass} inputClass={inputClass} error={errors.email} required />
              <Field label="Phone" name="phone" type="tel" className={labelClass} inputClass={inputClass} error={errors.phone} required />
              <Field label="Role / trade required" name="role" className={labelClass} inputClass={inputClass} error={errors.role} required />
              <Field label="Headcount" name="headcount" type="number" min={1} className={labelClass} inputClass={inputClass} error={errors.headcount} required />
              <Field label="Project location" name="location" className={`${labelClass} sm:col-span-2`} inputClass={inputClass} />

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="details" className={labelClass}>
                  Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  className={`${inputClass} h-[96px] resize-none py-3`}
                />
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="sm:col-span-2 rounded-[3px] border border-error/40 bg-error/10 px-4 py-3 text-[13.5px] text-error"
                >
                  Sorry — we couldn&rsquo;t send your requirement. Please check the fields above, or
                  email us directly at{" "}
                  <a href={`mailto:${contact.email}`} className="font-semibold underline">
                    {contact.email}
                  </a>
                  .
                </div>
              )}

              <div className="sm:col-span-2 mt-2 flex flex-col items-start gap-3">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="min-h-11 rounded bg-brand-orange px-7 py-[15px] text-[15px] font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:opacity-70"
                >
                  {status === "submitting" ? "Sending…" : "Send requirement"}
                </button>
                <span className="text-[13.5px] text-text-subtle-2">Response within 24 hours</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  min,
  required,
  className,
  inputClass,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  min?: number;
  required?: boolean;
  className: string;
  inputClass: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={className}>
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass}
      />
      {error && (
        <span id={`${name}-error`} className="text-[12.5px] text-error">
          {error}
        </span>
      )}
    </div>
  );
}
