import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, ShieldCheck, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { SITE } from "@/lib/config";
import { telLink, waLink } from "@/lib/utils";

const WHATSAPP_MSG = "Hi Urban Repair Expert! I need help with my appliance.";

export default function Footer() {
  return (
    <footer className="bg-slate-950 pb-24 text-slate-300 lg:pb-0">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {SITE.description}
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/5 p-3">
            <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-400" />
            <p className="text-xs leading-snug text-slate-300">
              Verified technicians · Genuine spare parts · Service warranty on every job
            </p>
          </div>
          <div className="mt-5 flex gap-3">
            {[
              { icon: Instagram, href: SITE.socials.instagram, label: "Instagram" },
              { icon: Facebook, href: SITE.socials.facebook, label: "Facebook" },
              { icon: Youtube, href: SITE.socials.youtube, label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition hover:bg-brand-600 hover:text-white"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Book a Repair", "/book"],
              ["Sell Old AC", "/sell"],
              ["Sell Old Refrigerator", "/sell"],
              ["Track Booking", "/track"],
              ["Blog & Tips", "/blog"],
              ["FAQs", "/#faq"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-1 text-slate-400 transition hover:text-white"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-brand-500" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Our Services</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              "AC Repair & Gas Refill",
              "Refrigerator Repair",
              "Washing Machine Repair",
              "Geyser Repair & Installation",
              "AC Deep Cleaning",
              "Old Appliance Buyback",
            ].map((s) => (
              <li key={s}>
                <Link href="/book" className="text-slate-400 transition hover:text-white">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-400" />
              <span>
                {SITE.address.line1}, {SITE.address.area},<br />
                {SITE.address.city}, {SITE.address.state} {SITE.address.pin}
              </span>
            </li>
            <li>
              <a href={telLink()} className="flex items-center gap-3 transition hover:text-white">
                <Phone className="h-4.5 w-4.5 shrink-0 text-brand-400" />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={waLink(WHATSAPP_MSG)} target="_blank" rel="noopener" className="flex items-center gap-3 transition hover:text-white">
                <WhatsAppIcon className="h-4.5 w-4.5 shrink-0 text-[#25D366]" />
                WhatsApp Us
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 transition hover:text-white">
                <Mail className="h-4.5 w-4.5 shrink-0 text-brand-400" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4.5 w-4.5 shrink-0 text-brand-400" />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Sell values shown are estimates; final offer depends on inspection.</p>
        </div>
      </div>
    </footer>
  );
}
