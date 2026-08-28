# Setup: GoDaddy domain → Vercel, and contact-form email via Resend

Two separate jobs that both use DNS records at GoDaddy:

1. **Point `talentsync-ae.com` at the Vercel site** (A + CNAME records)
2. **Let the contact form send email** (Resend verification records)

---

## ⚠️ Read this first — protect the existing email

`talentsync-ae.com` currently has these MX records:

```
0   smtp.secureserver.net
10  mailstore1.secureserver.net
```

That is **GoDaddy-hosted email — the `murad.f@talentsync-ae.com` mailbox.**

> **Do NOT change the nameservers to Vercel's.**
> Vercel will offer this. If you accept, DNS moves to Vercel, the MX records
> above disappear, and **the company email stops receiving mail.**

Instead, keep GoDaddy's nameservers (`ns23/ns24.domaincontrol.com`) and just add
records inside GoDaddy. Everything below assumes that, and carries no risk to email.

---

## Part A — Connect the domain to Vercel

### A1. Add the domain in Vercel

1. Vercel → your project → **Settings → Domains**
2. Enter `talentsync-ae.com` → **Add**
3. Also add `www.talentsync-ae.com` (Vercel will offer to redirect it to the apex — accept)
4. Vercel now shows the DNS records it wants. **Leave this page open** — you need
   the exact values it displays.

Vercel will likely warn "Nameservers do not match" or offer to move nameservers.
**Ignore that.** Choose the option to configure via **A / CNAME records** instead.

### A2. Add those records in GoDaddy

1. [dcc.godaddy.com](https://dcc.godaddy.com) → **My Products** → `talentsync-ae.com` → **DNS**
2. You'll see two existing **A** records on `@` pointing at `13.248.243.5` and
   `76.223.105.230` (GoDaddy's parking page). **Delete both** — they're what
   currently serves the placeholder site.
3. Add the records Vercel showed you. Typically:

   | Type  | Name | Value                        | TTL    |
   |-------|------|------------------------------|--------|
   | A     | `@`  | *(the IP Vercel displays)*   | 1 hour |
   | CNAME | `www`| `cname.vercel-dns.com`       | 1 hour |

   > Use the **exact** values from your Vercel dashboard. Vercel has changed its
   > IP over time and it can differ per account, so don't copy an IP from a blog
   > post or an old guide.

4. If a `www` CNAME already exists, **edit** it rather than adding a duplicate.

### A3. Wait and confirm

DNS usually updates in 10–30 minutes. Vercel's Domains page flips to a green
**Valid Configuration** and issues an HTTPS certificate automatically.

**Do not delete the MX or the `v=spf1 ... secureserver.net` TXT record.**

---

## Part B — Verify the domain in Resend

This is what allows the form to send to `murad.f@talentsync-ae.com`. Until it's
done, Resend only delivers to your own account address.

1. [resend.com](https://resend.com) → **Domains → Add Domain** → `talentsync-ae.com`
2. Resend shows ~3 records — a **DKIM** `TXT`, plus an `MX` and `TXT` on a
   **`send`** subdomain.
3. Add each one in GoDaddy DNS.

   **Entering the Name field:** GoDaddy appends the domain automatically. If
   Resend shows `resend._domainkey.talentsync-ae.com`, enter only
   `resend._domainkey`. Likewise `send.talentsync-ae.com` → just `send`.

4. Back in Resend, click **Verify**. Usually a few minutes.

**These do not touch your existing email.** Resend puts its MX and SPF on the
`send` subdomain, so the root MX (GoDaddy email) and root SPF are untouched.

---

## Part C — Environment variables in Vercel

Vercel → project → **Settings → Environment Variables**. Add three, for all
environments (Production, Preview, Development):

| Key              | Value                                             |
|------------------|---------------------------------------------------|
| `RESEND_API_KEY` | `re_...` from Resend → **API Keys**               |
| `CONTACT_FROM`   | `TalentSync Website <website@talentsync-ae.com>`  |
| `CONTACT_TO`     | `murad.f@talentsync-ae.com`                       |

`CONTACT_FROM` can be any address on the verified domain — the mailbox doesn't
need to exist, it's only the sender identity.

**Then redeploy.** Env vars only apply to new deployments:
**Deployments → latest → ⋯ → Redeploy**.

### Want it working before finishing Part B?

Set only `RESEND_API_KEY` and `CONTACT_TO=<your Resend account email>`, and leave
`CONTACT_FROM` unset. Enquiries arrive immediately via Resend's shared sender.
Switch `CONTACT_TO` to `murad.f@` once the domain verifies.

---

## Part D — Test it

1. Open the live site → **Contact** → submit the form
2. Expect the green "your requirement has been received" panel
3. Check `murad.f@talentsync-ae.com` — the email arrives with all fields, and
   **Reply** goes straight back to whoever submitted it

---

## Troubleshooting

Vercel → **Deployments → latest → Functions → `/api/contact`** shows the real cause.

| What you see | Cause | Fix |
|---|---|---|
| `Email is not configured on the server` | `RESEND_API_KEY` missing | Add it, then **redeploy** |
| `API key is invalid` | Wrong/rotated key | Create a new key, update Vercel |
| `You can only send testing emails to your own email address` | Domain not verified yet | Finish Part B, or set `CONTACT_TO` to your Resend account email |
| `The from address is not verified` | `CONTACT_FROM` domain ≠ verified domain | Use an address on `talentsync-ae.com`, or unset it |
| Form works, no email | Check spam; confirm `CONTACT_TO` | — |
| Site shows GoDaddy parking page | Old A records still present | Delete both parking A records (Part A2) |

## Security

- Never commit `RESEND_API_KEY` — `.env` is gitignored; keep keys in Vercel only.
- Rotate any key that's been pasted into chat, email, or WhatsApp.
- Keep Resend keys **Sending access** only, not Full access.
