import Container from "./ui/Container";
import { siteConfig } from "@/lib/data";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "About EduWeCan", href: "#about" },
      { label: "Find Solutions", href: "#solutions" },
      { label: "For Schools", href: "#for-schools" },
      { label: "For Vendors", href: "#for-vendors" },
    ],
  },
  {
    title: "Conference",
    links: [
      { label: "Overview", href: "#conference" },
      { label: "Speakers", href: "#speakers" },
      { label: "Agenda", href: "#conference" },
      { label: "Exhibition", href: "#conference" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Register Your School", href: "#for-schools" },
      { label: "List Your Solution", href: "#for-vendors" },
      { label: "Sponsorship", href: "#sponsorship" },
      { label: "Awards", href: "#awards" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Magazine", href: "#magazine" },
      { label: "Partners", href: "#partners" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

const socials = [
  { name: "LinkedIn", href: "#" },
  { name: "Twitter / X", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
  { name: "Facebook", href: "#" },
];

function scrollTo(id: string) {
  document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-edu-blue text-white">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-6 md:gap-8 md:py-20">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/15">
              <span className="text-white font-display font-bold text-[15px]">E</span>
            </div>
            <span className="font-display font-bold text-[20px] text-white">EduWeCan</span>
          </div>
          <p className="max-w-[26ch] text-[14px] leading-relaxed text-white/65">
            Connecting Schools, Innovation and Opportunity across India.
          </p>
          <div className="mt-6 flex flex-col gap-1.5 text-[13.5px] text-white/70">
            <span>{siteConfig.email}</span>
            <span>{siteConfig.phone}</span>
            <span>{siteConfig.location}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="text-[12.5px] font-medium tracking-wide text-white/55 hover:text-white transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 mb-4">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[13.5px] text-white/75 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-[12.5px] text-white/50 md:flex-row">
          <span>© 2027 EduWeCan. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
