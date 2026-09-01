"use client";

import { FormEvent, useState } from "react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const fieldClasses =
  "w-full rounded-sm border border-line bg-warm-white px-4 py-3 text-[14px] text-charcoal placeholder:text-charcoal/35 outline-none transition-colors focus:border-charcoal/50";

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="enquiry" className="bg-warm-white py-20 md:py-28">
      <Container className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow="Sponsorship Enquiry"
          title="Let's Talk About Your Partnership"
          subtitle="Tell us a little about your organization and goals. Our partnerships team responds to every enquiry within two business days."
        />

        <Reveal delay={80}>
          {submitted ? (
            <div className="flex h-full flex-col items-start justify-center gap-3 rounded-[1rem] border border-line bg-beige/40 p-10">
              <span className="font-display text-[24px] text-charcoal">
                Thank you.
              </span>
              <p className="max-w-[46ch] text-[14.5px] leading-relaxed text-charcoal/60">
                Your enquiry has been received. A member of our partnerships
                team will be in touch shortly to discuss the right fit for
                your organization.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-[1rem] border border-line bg-warm-white p-8 md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                  Full Name
                  <input required className={fieldClasses} type="text" name="name" placeholder="Jordan Ellis" />
                </label>
                <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                  Work Email
                  <input required className={fieldClasses} type="email" name="email" placeholder="jordan@company.com" />
                </label>
                <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                  Company
                  <input required className={fieldClasses} type="text" name="company" placeholder="Company name" />
                </label>
                <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                  Job Title
                  <input className={fieldClasses} type="text" name="title" placeholder="VP of Marketing" />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                Sponsorship Interest
                <select className={fieldClasses} name="interest" defaultValue="Not sure yet">
                  <option>Title Partner</option>
                  <option>Platinum</option>
                  <option>Gold</option>
                  <option>Technology Partner</option>
                  <option>Not sure yet</option>
                </select>
              </label>

              <label className="flex flex-col gap-2 text-[13px] font-medium text-charcoal/70">
                Message
                <textarea
                  className={`${fieldClasses} min-h-[110px] resize-none`}
                  name="message"
                  placeholder="Tell us about your goals for this partnership."
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-sm bg-charcoal px-6 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-warm-white transition-colors hover:bg-charcoal-soft"
              >
                Submit Enquiry
              </button>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
