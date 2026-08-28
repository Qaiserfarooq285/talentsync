import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contact } from "@/lib/content";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  role?: string;
  headcount?: string;
  location?: string;
  details?: string;
  /** Honeypot — real users never fill this; bots usually do. */
  website?: string;
};

function validate(data: Payload) {
  const errors: Record<string, string> = {};
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const role = (data.role ?? "").trim();
  const headcount = (data.headcount ?? "").trim();

  if (!name) errors.name = "Full name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (!phone) errors.phone = "Phone number is required.";
  if (!role) errors.role = "Role / trade required is required.";
  if (!headcount) errors.headcount = "Headcount is required.";
  else if (!/^\d+$/.test(headcount) || Number(headcount) < 1)
    errors.headcount = "Headcount must be a number of 1 or more.";

  return errors;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots don't learn they were caught.
  if (data.website) return NextResponse.json({ ok: true });

  const errors = validate(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("Contact form: SMTP environment variables are not configured.");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on the server." },
      { status: 500 }
    );
  }

  const port = Number(SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 upgrades via STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows: [string, string][] = [
    ["Name", data.name ?? ""],
    ["Company", data.company ?? "—"],
    ["Email", data.email ?? ""],
    ["Phone", data.phone ?? ""],
    ["Role / trade", data.role ?? ""],
    ["Headcount", data.headcount ?? ""],
    ["Project location", data.location ?? "—"],
    ["Details", data.details ?? "—"],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <h2 style="font-family:sans-serif;color:#12263e">New manpower request</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr>
               <td style="padding:6px 14px 6px 0;color:#6b7c90;vertical-align:top"><strong>${escapeHtml(k)}</strong></td>
               <td style="padding:6px 0;color:#12263e;white-space:pre-wrap">${escapeHtml(v)}</td>
             </tr>`
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;color:#8b9aab;font-size:12px">
      Sent from the TalentSync website contact form.
    </p>`;

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: CONTACT_TO || contact.email,
      replyTo: data.email,          // replying goes straight back to the enquirer
      subject: `Manpower request — ${data.name} (${data.role}, ${data.headcount})`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form: failed to send email.", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please email us directly." },
      { status: 502 }
    );
  }
}
