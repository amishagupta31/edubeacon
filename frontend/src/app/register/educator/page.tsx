import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import { School, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Register Your School, EduBeacon",
  description: "Register your school on EduBeacon and discover innovative solutions.",
};

export default function EducatorRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF8] to-white pt-24 pb-16">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <School className="w-8 h-8 text-[#0E733B]" />
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4">Register Your School</h1>
            <p className="text-lg text-slate-600">
              Join EduBeacon and discover the best solutions for your school
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 md:p-10 mb-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter school name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Principal/Head Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="School location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  What solutions are you looking for? *
                </label>
                <textarea
                  placeholder="Tell us about your school's requirements"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0E733B] focus:ring-2 focus:ring-[#0E733B]/20 resize-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0E733B] hover:bg-[#0B5C2F] text-white py-4 rounded-lg font-bold text-base transition-colors shadow-md"
              >
                Register Your School
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-8">
            <h3 className="font-bold text-lg text-charcoal mb-6">Have questions?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm text-[#0E733B] hover:underline">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Phone</p>
                  <a href={`tel:${siteConfig.phone}`} className="text-sm text-[#0E733B] hover:underline">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0E733B] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-charcoal">Location</p>
                  <p className="text-sm text-slate-600">{siteConfig.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
