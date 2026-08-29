// Regenerates public/TalentSync_Company_Profile.pdf from src/lib/content.ts,
// so the downloadable profile can never drift from the website copy.
//
//   npm run profile
//
// Renders through headless Chrome, which is what produces the A4 PDF.
import { writeFileSync, unlinkSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const IMG = `file://${join(SITE, "public/images")}`;
const OUT = join(SITE, "public/TalentSync_Company_Profile.pdf");
const TMP_HTML = join(HERE, ".profile.tmp.html");
const TMP_MJS = join(HERE, ".content.tmp.mjs");

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** content.ts is plain data; strip its two type annotations so Node can import it. */
function loadContent() {
  let src = readFileSync(join(SITE, "src/lib/content.ts"), "utf8");
  src = src.replace(/export type Client = \{[\s\S]*?\};\n/, "");
  src = src.replace(/: Client\[\]/g, "");
  writeFileSync(TMP_MJS, src);
  return import(pathToFileURL(TMP_MJS).href);
}

const c = await loadContent();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const year = new Date().getFullYear();

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>TalentSync Manpower Services — Company Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#0b3c74; --ink:#12263e; --deep:#0a1f38; --blue:#1266c4;
    --orange:#f5751a; --orange-l:#ffa04d; --body:#55677b; --muted:#6b7c90;
    --line:#e4e9ef; --alt:#f4f7fb;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  @page{size:A4;margin:0}
  html,body{font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:var(--ink);background:#fff;color-scheme:light;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{width:210mm;height:297mm;padding:16mm 15mm 14mm;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column;background:#fff}
  .page:last-child{page-break-after:auto}

  /* ---- cover ---- */
  .cover{padding:0;background:var(--deep);color:#fff;justify-content:flex-end}
  .cover-img{position:absolute;inset:0}
  .cover-img img{width:100%;height:100%;object-fit:cover;opacity:.30}
  .cover-wash{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,31,56,.72) 0%,rgba(10,31,56,.86) 55%,rgba(10,31,56,.97) 100%)}
  .cover-inner{position:relative;padding:0 18mm 18mm}
  .cover-logo{position:absolute;top:16mm;left:18mm;height:15mm}
  .eyebrow{font-size:9.5pt;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--orange-l)}
  .cover h1{font-size:34pt;font-weight:800;line-height:1.08;margin-top:5mm;letter-spacing:-.5pt}
  .cover h1 span{color:var(--orange-l)}
  .cover .tag{margin-top:6mm;font-size:11.5pt;line-height:1.62;color:rgba(255,255,255,.80);max-width:150mm}
  .cover-stats{display:flex;gap:12mm;margin-top:11mm;padding-top:8mm;border-top:1px solid rgba(255,255,255,.18)}
  .cover-stats .v{font-size:20pt;font-weight:800;color:#fff;line-height:1}
  .cover-stats .l{font-size:8.5pt;color:rgba(255,255,255,.62);margin-top:2mm}
  .cover-meta{margin-top:9mm;font-size:9.5pt;color:rgba(255,255,255,.72);display:flex;gap:7mm;flex-wrap:wrap}
  .cover-meta b{color:var(--orange-l);font-weight:600}

.hero-band{position:relative;height:44mm;border-radius:3mm;overflow:hidden;margin-bottom:7mm}
  .hero-band img{width:100%;height:100%;object-fit:cover;object-position:center 32%}
  .hero-band .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,60,116,.88) 0%,rgba(11,60,116,.55) 45%,rgba(11,60,116,.10) 100%)}
  .hero-band .cap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 8mm;color:#fff}
  .hero-band .cap .k{font-size:8pt;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--orange-l)}
  .hero-band .cap .t{font-size:15pt;font-weight:800;margin-top:2mm;line-height:1.2;max-width:105mm}

  .split{display:grid;grid-template-columns:1fr 62mm;gap:6mm;align-items:start}
  .split-img{border-radius:3mm;overflow:hidden;height:72mm}
  .split-img img{width:100%;height:100%;object-fit:cover}

  .map-wrap{background:var(--alt);border-radius:3mm;padding:3mm;text-align:center}
  .map-wrap img{width:100%;height:36mm;object-fit:contain}

  .strip{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:5mm}
  .strip div{height:24mm;border-radius:2.5mm;overflow:hidden}
  .strip img{width:100%;height:100%;object-fit:cover}

  /* ---- shared ---- */
  .sec-label{font-size:8.5pt;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--orange)}
  h2{font-size:19pt;font-weight:800;color:var(--ink);margin-top:3mm;letter-spacing:-.3pt}
  h3{font-size:11pt;font-weight:700;color:var(--ink)}
  p{font-size:10pt;line-height:1.66;color:var(--body)}
  .rule{height:2.4pt;width:16mm;background:var(--orange);border-radius:2pt;margin:4mm 0 6mm}
  .block{margin-bottom:8mm}
  .stack > * + *{margin-top:3mm}

  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
  .card{border:1px solid var(--line);border-radius:3mm;padding:5mm;background:#fff}
  .card.alt{background:var(--alt)}
  .card p{font-size:9pt;margin-top:2mm}

  .vm{border-left:3pt solid var(--orange);padding-left:5mm}
  .vm + .vm{margin-top:6mm}

  .snap{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--line);border-radius:3mm;overflow:hidden}
  .snap div{padding:5mm;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
  .snap div:nth-child(3n){border-right:none}
  .snap div:nth-child(n+4){border-bottom:none}
  .snap .l{font-size:8pt;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
  .snap .v{font-size:14pt;font-weight:800;color:var(--navy);margin-top:1.5mm}

  .svc{display:flex;gap:4mm;padding:3.6mm 0;border-bottom:1px solid var(--line)}
  .svc:last-child{border-bottom:none}
  .num{flex:0 0 9mm;height:9mm;border-radius:2mm;background:var(--navy);color:#fff;font-size:10pt;font-weight:800;display:flex;align-items:center;justify-content:center}
  .svc p{font-size:9pt;margin-top:1.5mm}

  .steps{display:flex;gap:3mm}
  .step{flex:1;text-align:center}
  .step .dot{width:11mm;height:11mm;border-radius:50%;background:var(--orange);color:#fff;font-weight:800;font-size:11pt;display:flex;align-items:center;justify-content:center;margin:0 auto 3mm}
  .step h3{font-size:9.5pt}
  .step p{font-size:8pt;margin-top:1.5mm}

  ul.checks{list-style:none}
  ul.checks li{position:relative;padding-left:6mm;font-size:9.5pt;line-height:1.6;color:var(--body)}
  ul.checks li + li{margin-top:2.5mm}
  ul.checks li::before{content:"";position:absolute;left:0;top:1.8mm;width:2.6mm;height:2.6mm;background:var(--orange);border-radius:.6mm}

  .inds{display:grid;grid-template-columns:repeat(3,1fr);gap:3.5mm}
  .ind{border-radius:2.5mm;overflow:hidden;position:relative;height:26mm}
  .ind img{width:100%;height:100%;object-fit:cover}
  .ind span{position:absolute;inset:auto 0 0 0;background:linear-gradient(transparent,rgba(10,31,56,.93));color:#fff;font-size:8pt;font-weight:600;padding:6mm 3mm 2.5mm;line-height:1.25}

  .regions{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
  .region{background:var(--alt);border-radius:3mm;padding:5mm}
  .region h3{font-size:10pt;color:var(--navy)}
  .chips{display:flex;flex-wrap:wrap;gap:1.8mm;margin-top:3mm}
  .chip{font-size:8pt;font-weight:600;background:#fff;border:1px solid var(--line);border-radius:10mm;padding:1.4mm 3mm;color:var(--ink)}

  .proj{border-left:3pt solid var(--navy);padding-left:5mm;margin-bottom:5mm}
  .proj h3{font-size:10pt;color:var(--navy)}
  .proj p{font-size:9pt;margin-top:1.5mm}

  .logos{display:grid;grid-template-columns:repeat(5,1fr);gap:3mm;margin-top:4mm}
  .logo{height:16mm;border:1px solid var(--line);border-radius:2mm;display:flex;align-items:center;justify-content:center;padding:3mm;background:#fff}
  .logo img{max-width:100%;max-height:100%;object-fit:contain}
  .logo span{font-size:7.5pt;font-weight:700;color:var(--ink);text-align:center;line-height:1.2}

  .founder{display:flex;gap:6mm;align-items:flex-start;background:var(--alt);border-radius:3mm;padding:6mm}
  .founder img{width:34mm;height:40mm;object-fit:cover;object-position:center 20%;border-radius:2.5mm;flex:0 0 auto}
  .founder .t{font-size:8.5pt;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:.1em}
  .founder h3{font-size:14pt;margin-top:1.5mm}
  .founder p{font-size:9pt;margin-top:2.5mm}

  .cta{margin-top:auto;background:var(--navy);color:#fff;border-radius:3mm;padding:8mm}
  .cta h3{color:#fff;font-size:15pt}
  .cta p{color:rgba(255,255,255,.78);font-size:9.5pt;margin-top:2.5mm}
  .cta-rows{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:6mm}
  .cta-rows div{font-size:9.5pt}
  .cta-rows .k{font-size:8pt;color:var(--orange-l);text-transform:uppercase;letter-spacing:.1em;font-weight:700}
  .cta-rows .v{margin-top:1mm;color:#fff;font-weight:600}

  .foot{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;font-size:7.5pt;color:var(--muted);border-top:1px solid var(--line);padding-top:3mm}
</style></head><body>

<!-- 1 COVER -->
<section class="page cover">
  <div class="cover-img"><img src="${IMG}/hero-bg-2.jpg"></div>
  <div class="cover-wash"></div>
  <img class="cover-logo" src="${IMG}/talentsync-logo.png">
  <div class="cover-inner">
    <div class="eyebrow">Company Profile · ${year}</div>
    <h1>Your Trusted Partner for<br><span>Skilled Manpower Solutions</span><br>Across Africa, the GCC &amp; Beyond</h1>
    <p class="tag">${esc(c.tagline)}</p>
    <div class="cover-stats">
      ${c.stats.map((s) => `<div><div class="v">${esc(s.value)}</div><div class="l">${esc(s.label)}</div></div>`).join("")}
    </div>
    <div class="cover-meta">
      <span><b>Head office</b> &nbsp;${esc(c.contact.location)}</span>
      <span><b>Phone</b> &nbsp;${esc(c.contact.phone)}</span>
      <span><b>Email</b> &nbsp;${esc(c.contact.email)}</span>
    </div>
  </div>
</section>

<!-- 2 ABOUT -->
<section class="page">
  <div class="sec-label">About Us</div>
  <h2>Who We Are</h2><div class="rule"></div>
  <div class="split block">
    <div class="stack">${c.aboutParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="split-img"><img src="${IMG}/industry-construction.jpg"></div>
  </div>

  <div class="block">
    <div class="vm"><h3>Our Vision</h3><p style="margin-top:2mm">${esc(c.vision)}</p></div>
    <div class="vm"><h3>Our Mission</h3><p style="margin-top:2mm">${esc(c.mission)}</p></div>
  </div>

  <div class="block">
    <h3 style="margin-bottom:4mm">Company Snapshot</h3>
    <div class="snap">
      ${c.snapshot.map((s) => `<div><div class="l">${esc(s.label)}</div><div class="v">${esc(s.value)}</div></div>`).join("")}
    </div>
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>02</span></div>
</section>

<!-- 3 VALUES + SERVICES -->
<section class="page">
  <div class="hero-band">
    <img src="${IMG}/industry-engineering.jpg">
    <div class="veil"></div>
    <div class="cap">
      <div class="k">What We Stand For</div>
      <div class="t">Vetted people, delivered on time</div>
    </div>
  </div>
  <h2>Our Core Values</h2><div class="rule"></div>
  <div class="grid3 block">
    ${c.coreValues.map((v) => `<div class="card alt"><h3 style="font-size:10pt">${esc(v.title)}</h3><p>${esc(v.body)}</p></div>`).join("")}
  </div>

  <div class="sec-label" style="margin-top:3mm">What We Do</div>
  <h2>Our Services</h2><div class="rule"></div>
  <div>
    ${c.services.map((s) => `<div class="svc"><div class="num">${esc(s.number)}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></div>`).join("")}
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>03</span></div>
</section>

<!-- 4 PROCESS + QUALITY + INDUSTRIES -->
<section class="page">
  <div class="sec-label">How We Work</div>
  <h2>Our Recruitment Process</h2><div class="rule"></div>
  <div class="steps block">
    ${c.processSteps.map((s) => `<div class="step"><div class="dot">${esc(s.number)}</div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`).join("")}
  </div>

  <div class="block">
    <h3 style="margin-bottom:4mm">Quality Standards</h3>
    <ul class="checks">${c.qualityStandards.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
  </div>

  <div class="sec-label" style="margin-top:3mm">Sectors</div>
  <h2>Industries We Serve</h2><div class="rule"></div>
  <div class="inds">
    ${c.industries.map((i) => `<div class="ind"><img src="${IMG}/${i.image.split("/").pop()}"><span>${esc(i.name)}</span></div>`).join("")}
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>04</span></div>
</section>

<!-- 5 REACH + PROJECTS -->
<section class="page">
  <div class="sec-label">Coverage</div>
  <h2>Regional Reach</h2><div class="rule"></div>
  <p>${esc(c.regionalReachBody)}</p>
  <div class="map-wrap block" style="margin-top:5mm"><img src="${IMG}/region-map.svg"></div>
  <div class="regions block">
    <div class="region">
      <h3>Africa &middot; ${c.africaCountries.length} countries</h3>
      <div class="chips">${c.africaCountries.map((x) => `<span class="chip">${esc(x.name)}</span>`).join("")}</div>
    </div>
    <div class="region">
      <h3>Gulf &amp; Middle East &middot; ${c.gulfCountries.length} countries</h3>
      <div class="chips">${c.gulfCountries.map((x) => `<span class="chip">${esc(x.name)}</span>`).join("")}</div>
    </div>
  </div>

  <div class="sec-label" style="margin-top:3mm">Track Record</div>
  <h2>Project Highlights</h2><div class="rule"></div>
  <div>
    ${c.projectHighlights.map((p) => `<div class="proj"><h3>${esc(p.label)}</h3><p>${esc(p.body)}</p></div>`).join("")}
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>05</span></div>
</section>

<!-- 6 CLIENTS + WHY -->
<section class="page">
  <div class="sec-label">Our Network</div>
  <h2>Clients &amp; Partners</h2><div class="rule"></div>
  <p>${esc(c.networkParagraphs[0])}</p>
  <div class="logos block">
    ${c.clients.map((cl) => cl.logo
      ? `<div class="logo"><img src="${IMG}/clients/${cl.logo.split("/").pop()}"></div>`
      : `<div class="logo"><span>${esc(cl.name)}</span></div>`).join("")}
  </div>

  <div class="sec-label" style="margin-top:3mm">The Difference</div>
  <h2>Why Choose TalentSync</h2><div class="rule"></div>
  <div class="grid2">
    ${c.whyChoose.map((w) => `<div class="card"><h3 style="font-size:10pt">${esc(w.title)}</h3><p>${esc(w.body)}</p></div>`).join("")}
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>06</span></div>
</section>

<!-- 7 FOUNDER + CTA -->
<section class="page">
  <div class="sec-label">Leadership</div>
  <h2>Founder &amp; CEO</h2><div class="rule"></div>
  <div class="founder block">
    <img src="${IMG}/${c.founder.photo.split("/").pop()}">
    <div>
      <div class="t">${esc(c.founder.title)}</div>
      <h3>${esc(c.founder.name)}</h3>
      ${c.founder.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
    </div>
  </div>

  <div class="block">
    <h3 style="margin-bottom:4mm">How To Get Started</h3>
    <div class="steps">
      ${c.getStartedSteps.map((s) => `<div class="step"><div class="dot">${esc(s.number)}</div><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`).join("")}
    </div>
  </div>

  <div class="strip">
    <div><img src="${IMG}/industry-oil-gas.jpg"></div>
    <div><img src="${IMG}/industry-mining.jpg"></div>
    <div><img src="${IMG}/industry-logistics.jpg"></div>
  </div>

  <div class="cta" style="margin-top:6mm">
    <h3>Ready to mobilise your team?</h3>
    <p>${esc(c.contactIntro)}</p>
    <div class="cta-rows">
      <div><div class="k">Head Office</div><div class="v">${esc(c.contact.location)}</div></div>
      <div><div class="k">Availability</div><div class="v">${esc(c.contact.availability)}</div></div>
      <div><div class="k">Phone / WhatsApp</div><div class="v">${esc(c.contact.phone)}</div></div>
      <div><div class="k">Email</div><div class="v">${esc(c.contact.email)}</div></div>
    </div>
  </div>
  <div class="foot"><span>TalentSync Manpower Services &middot; Company Profile</span><span>07</span></div>
</section>

</body></html>`;

writeFileSync(TMP_HTML, html);

execFileSync(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--virtual-time-budget=15000",
    `--print-to-pdf=${OUT}`,
    pathToFileURL(TMP_HTML).href,
  ],
  { stdio: "ignore" }
);

// PROFILE_KEEP_HTML=1 leaves the intermediate page behind for layout debugging.
if (!process.env.PROFILE_KEEP_HTML) unlinkSync(TMP_HTML);
unlinkSync(TMP_MJS);
console.log(`Wrote ${OUT}`);
