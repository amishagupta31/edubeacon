// ── Event facts — single source of truth for every outgoing email ──
const MAP_QUERY = "Shivalik University, Shimla Road, Sherpur, Dehradun, Uttarakhand 248197";

export const EVENT = {
  name: "Principal Conclave on “AI in School Education”",
  namePlain: "Principal Conclave on AI in School Education",
  organisers: "Edubeacon & India Genius Foundation",
  date: "25th October 2026",
  time: "9:00 AM",
  venue: "Shivalik University, Dehradun",
  addressLines: [
    "Shivalik University, Dehradun Shiniwala,",
    "P.O. Sherpur, Shimla Road,",
    "Dehradun – 248197, Uttarakhand",
  ],
  landmark: "500 metres from Chakrata Road, Dhoolkot",
  mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  mapQuery: MAP_QUERY,

  // Signatory
  signerName: "Dr. Amit Sehgal",
  signerTitle: "Educationist & Former Principal",
  signerRole: "Organiser – Edubeacon & India Genius Foundation, Dehradun, Uttarakhand",
  phone: "7819952571",
  contactEmail: "info@edubeacon.co.in",
  site: "https://edubeacon.co.in/",
  olympiadSite: "https://www.geniousolympiad.in",
};

/**
 * Static map thumbnail. Google's Static Maps API needs a key; without one we
 * return null and the template falls back to the address block plus button.
 */
function staticMapUrl(): string | null {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const q = encodeURIComponent(EVENT.mapQuery);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${q}&zoom=15&size=600x240&scale=2&maptype=roadmap&markers=color:0x0E733B%7C${q}&key=${key}`;
}

const BRAND = "#04312c";
const ACCENT = "#0E733B";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

type Detail = { label: string; value: unknown };

const detailRows = (details: Detail[]) =>
  details
    .filter((d) => d.value !== undefined && d.value !== null && String(d.value).trim() !== "")
    .map(
      (d) => `
        <tr>
          <td style="padding:7px 0;color:#64748b;font-size:13px;width:40%;vertical-align:top;">${esc(d.label)}</td>
          <td style="padding:7px 0;color:#1e293b;font-size:13px;font-weight:600;">${esc(
            Array.isArray(d.value) ? d.value.join(", ") : d.value
          )}</td>
        </tr>`
    )
    .join("");

/** Shared shell: header, body, event block (optional), details, signature, footer. */
function shell(opts: {
  heading: string;
  intro: string;
  showEvent: boolean;
  details: Detail[];
  detailsTitle: string;
  nextSteps: string[];
  closing?: string;
}) {
  const { heading, intro, showEvent, details, detailsTitle, nextSteps, closing } = opts;

  const mapImg = staticMapUrl();

  const mapBlock = `
    <tr><td style="padding:0;">
      <a href="${EVENT.mapLink}" style="display:block;text-decoration:none;">
        ${
          mapImg
            ? `<img src="${mapImg}" alt="Map to ${esc(EVENT.venue)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-top:1px solid #bbf7d0;border-bottom:1px solid #bbf7d0;" />`
            : ""
        }
      </a>
    </td></tr>`;

  const eventBlock = showEvent
    ? `
    <tr><td style="padding:0 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin:8px 0 24px;overflow:hidden;">
        <tr><td style="padding:20px 22px 18px;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${ACCENT};">Event Details</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#475569;width:62px;vertical-align:top;">Date</td>
              <td style="padding:5px 0;font-size:13px;color:#1e293b;font-weight:600;">${esc(EVENT.date)}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#475569;vertical-align:top;">Time</td>
              <td style="padding:5px 0;font-size:13px;color:#1e293b;font-weight:600;">${esc(EVENT.time)}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;color:#475569;vertical-align:top;">Venue</td>
              <td style="padding:5px 0;font-size:13px;color:#1e293b;font-weight:600;line-height:1.55;">
                ${EVENT.addressLines.map((l) => esc(l)).join("<br />")}
                <span style="display:block;margin-top:5px;font-weight:400;color:#64748b;font-size:12px;">(${esc(EVENT.landmark)})</span>
              </td>
            </tr>
          </table>
        </td></tr>
        ${mapBlock}
        <tr><td style="padding:16px 22px 20px;text-align:center;">
          <a href="${EVENT.mapLink}" style="display:inline-block;padding:11px 24px;background:${ACCENT};color:#ffffff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:700;">Get Directions on Google Maps</a>
        </td></tr>
      </table>
    </td></tr>`
    : "";

  const closingBlock = closing
    ? `<tr><td style="padding:0 32px 4px;">
         <p style="margin:0;font-size:14.5px;line-height:1.65;color:#475569;">${closing}</p>
       </td></tr>`
    : "";

  const signature = `
    <tr><td style="padding:22px 32px 28px;">
      <p style="margin:0 0 14px;font-size:14px;color:#475569;">Warm regards,</p>
      <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:${BRAND};">${esc(EVENT.signerName)}</p>
      <p style="margin:0 0 2px;font-size:13px;color:#64748b;">${esc(EVENT.signerTitle)}</p>
      <p style="margin:0 0 10px;font-size:13px;color:#64748b;line-height:1.5;">${esc(EVENT.signerRole)}</p>
      <p style="margin:0;font-size:13px;color:#475569;line-height:1.8;">
        <a href="tel:${EVENT.phone}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${esc(EVENT.phone)}</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:${EVENT.contactEmail}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${esc(EVENT.contactEmail)}</a>
        <br />
        <a href="${EVENT.site}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${esc(EVENT.site)}</a>
        &nbsp;&middot;&nbsp;
        <a href="${EVENT.olympiadSite}" style="color:${ACCENT};text-decoration:none;font-weight:600;">www.geniousolympiad.in</a>
      </p>
    </td></tr>`;

  const detailsBlock = details.length
    ? `
    <tr><td style="padding:0 32px 24px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#94a3b8;">${esc(detailsTitle)}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
        ${detailRows(details)}
      </table>
    </td></tr>`
    : "";

  const stepsBlock = nextSteps.length
    ? `
    <tr><td style="padding:0 32px 28px;">
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#94a3b8;">What Happens Next</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${nextSteps
          .map(
            (s) => `<tr><td style="padding:5px 0;font-size:13.5px;color:#475569;line-height:1.6;">
              <span style="color:${ACCENT};font-weight:700;">&#8226;</span>&nbsp;&nbsp;${esc(s)}
            </td></tr>`
          )
          .join("")}
      </table>
    </td></tr>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f4;padding:28px 12px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.07);">

        <tr><td style="background:${BRAND};padding:26px 32px;">
          <p style="margin:0;font-size:19px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">eduBeacon</p>
          <p style="margin:5px 0 0;font-size:11px;color:#6ee7b7;letter-spacing:1.1px;text-transform:uppercase;font-weight:600;">Edubeacon &amp; India Genius Foundation</p>
        </td></tr>

        <tr><td style="padding:32px 32px 20px;">
          <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${BRAND};font-weight:700;">${esc(heading)}</h1>
          <p style="margin:0;font-size:14.5px;line-height:1.65;color:#475569;">${intro}</p>
        </td></tr>

        ${eventBlock}
        ${detailsBlock}
        ${stepsBlock}
        ${closingBlock}
        ${signature}

        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 6px;font-size:12.5px;color:#64748b;line-height:1.6;">
            Questions? Reply to this email or write to
            <a href="mailto:${EVENT.contactEmail}" style="color:${ACCENT};font-weight:600;text-decoration:none;">${EVENT.contactEmail}</a>
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">
            &copy; ${new Date().getFullYear()} Edubeacon &amp; India Genius Foundation
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

const textEvent = `
EVENT DETAILS
  Date:  ${EVENT.date}
  Time:  ${EVENT.time}
  Venue: ${EVENT.addressLines.join("\n         ")}
         (${EVENT.landmark})
  Map:   ${EVENT.mapLink}
`;

const textDetails = (title: string, details: Detail[]) => {
  const rows = details
    .filter((d) => d.value !== undefined && d.value !== null && String(d.value).trim() !== "")
    .map((d) => `  ${d.label}: ${Array.isArray(d.value) ? d.value.join(", ") : d.value}`)
    .join("\n");
  return rows ? `\n${title.toUpperCase()}\n${rows}\n` : "";
};

const textFooter = `
Warm regards,

${EVENT.signerName}
${EVENT.signerTitle}
${EVENT.signerRole}
${EVENT.phone}  |  ${EVENT.contactEmail}
${EVENT.site}  |  www.geniousolympiad.in`;

// ════════════════════════════════════════════════════════════════════════════
// 1. Conference registration
// ════════════════════════════════════════════════════════════════════════════
export function conferenceEmail(r: Record<string, unknown>) {
  const name = String(r.name ?? "").trim();
  const details: Detail[] = [
    { label: "Name", value: r.name },
    { label: "Email", value: r.email },
    { label: "Role", value: r.role },
    { label: "School / Institution", value: r.school },
    { label: "City", value: r.city },
    { label: "State", value: r.state },
    { label: "Phone", value: r.phone },
    { label: "Teaching Experience", value: r.experience },
    { label: "AI Tools Used", value: r.aiTools },
    { label: "Interested In", value: r.servicesExplored },
  ];

  const greeting = name ? `Dear ${esc(name)},` : "Dear Sir/Madam,";
  const greetingText = name ? `Dear ${name},` : "Dear Sir/Madam,";

  return {
    subject: `Thank You for Your Registration – ${EVENT.namePlain}`,
    html: shell({
      heading: greeting,
      intro: `Greetings from India Genius Foundation!<br /><br />
        Thank you for registering for the <strong>${esc(EVENT.name)}</strong>, organised by
        <strong>${esc(EVENT.organisers)}</strong>. We sincerely appreciate your interest and look
        forward to your valuable participation in this initiative.`,
      showEvent: true,
      details,
      detailsTitle: "Your Registration Details",
      nextSteps: [],
      closing: "Thank you once again for your registration and support.",
    }),
    text: `${greetingText}

Greetings from India Genius Foundation!

Thank you for registering for the ${EVENT.name}, organised by ${EVENT.organisers}. We sincerely appreciate your interest and look forward to your valuable participation in this initiative.
${textEvent}${textDetails("Your Registration Details", details)}
Thank you once again for your registration and support.
${textFooter}`,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Vendor / sponsor application
// ════════════════════════════════════════════════════════════════════════════
export function vendorEmail(r: Record<string, unknown>) {
  const contact = String(r.contactPerson ?? "there");
  const details: Detail[] = [
    { label: "Company", value: r.companyName },
    { label: "Contact Person", value: r.contactPerson },
    { label: "Designation", value: r.designation },
    { label: "Email", value: r.email },
    { label: "Phone", value: r.phone },
    { label: "Category", value: r.category },
    { label: "Website", value: r.website },
  ];
  const nextSteps = [
    "Our partnerships team will review your application within 2–3 business days.",
    "We'll be in touch to discuss sponsorship tiers and exhibition options.",
    "Shortlisted partners are invited to the curated sponsor–school round tables.",
  ];

  return {
    subject: `Thank You for Your Application – ${EVENT.namePlain}`,
    html: shell({
      heading: `Thank you, ${esc(contact.split(" ")[0])}!`,
      intro: `We've received the application from <strong>${esc(String(r.companyName ?? "your company"))}</strong> to partner with EduBeacon at the <strong>${esc(EVENT.name)}</strong>.`,
      showEvent: true,
      details,
      detailsTitle: "Your Application Details",
      nextSteps,
    }),
    text: `Thank you, ${contact}!

We've received your application to partner with EduBeacon at the ${EVENT.name}.
${textEvent}${textDetails("Your Application Details", details)}
WHAT HAPPENS NEXT
${nextSteps.map((s) => `  • ${s}`).join("\n")}
${textFooter}`,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Interest lead
// ════════════════════════════════════════════════════════════════════════════
export function interestEmail(r: Record<string, unknown>) {
  const name = String(r.name ?? "there");
  const details: Detail[] = [
    { label: "Name", value: r.name },
    { label: "School / Organization", value: r.school },
    { label: "Designation", value: r.designation },
    { label: "Email", value: r.email },
    { label: "Phone", value: r.phone },
    { label: "Interested In", value: r.vendorName },
    { label: "Requirement", value: r.requirement },
  ];
  const nextSteps = [
    "Our team will connect you with the right solution provider within 24–48 hours.",
    "You'll receive a tailored introduction based on your stated requirement.",
  ];

  return {
    subject: "Thank You for Your Interest – EduBeacon",
    html: shell({
      heading: `Thank you for reaching out, ${esc(name.split(" ")[0])}!`,
      intro: `We've received your enquiry${r.vendorName ? ` about <strong>${esc(String(r.vendorName))}</strong>` : ""}. Our team will connect you with the right solution provider shortly.`,
      showEvent: false,
      details,
      detailsTitle: "Your Enquiry",
      nextSteps,
    }),
    text: `Thank you for reaching out, ${name}!

We've received your enquiry${r.vendorName ? ` about ${r.vendorName}` : ""}.
${textDetails("Your Enquiry", details)}
WHAT HAPPENS NEXT
${nextSteps.map((s) => `  • ${s}`).join("\n")}
${textFooter}`,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Award nomination
// ════════════════════════════════════════════════════════════════════════════
export function awardEmail(r: Record<string, unknown>) {
  const nominator = String(r.nominatorName ?? "there");
  const details: Detail[] = [
    { label: "Award Category", value: r.category },
    { label: "Nominee", value: r.nomineeName },
    { label: "Nominee Organization", value: r.nomineeOrg },
    { label: "Nominated By", value: r.nominatorName },
    { label: "Your Email", value: r.nominatorEmail },
  ];
  const nextSteps = [
    "The Awards Committee will review all nominations.",
    "Shortlisted nominees will be notified by email ahead of the ceremony.",
    `Winners are announced at the awards ceremony on ${EVENT.date}.`,
  ];

  return {
    subject: `Nomination Received – Excellence in Education Awards`,
    html: shell({
      heading: `Thank you for your nomination, ${esc(nominator.split(" ")[0])}!`,
      intro: `We've received your nomination of <strong>${esc(String(r.nomineeName ?? "your nominee"))}</strong> for the Excellence in Education Awards, presented at the <strong>${esc(EVENT.name)}</strong>.`,
      showEvent: true,
      details,
      detailsTitle: "Nomination Details",
      nextSteps,
    }),
    text: `Thank you for your nomination, ${nominator}!

We've received your nomination of ${r.nomineeName ?? "your nominee"} for the Excellence in Education Awards.
${textEvent}${textDetails("Nomination Details", details)}
WHAT HAPPENS NEXT
${nextSteps.map((s) => `  • ${s}`).join("\n")}
${textFooter}`,
  };
}
