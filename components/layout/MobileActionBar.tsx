"use client";

import { usePathname } from "next/navigation";
import { Phone, Truck } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telLink, waLink } from "@/lib/utils";

const MSG = "Hi Urban Repair Expert! I want to book a repair service.";

export default function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  if (pathname === "/sell") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-3 pb-safe">
          <a
            href={telLink()}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold text-slate-600 active:text-brand-700"
          >
            <Phone className="h-5 w-5" /> Call Now
          </a>
          <a
            href={waLink(MSG)}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center justify-center gap-1 border-x border-slate-100 py-2.5 text-[11px] font-bold text-emerald-600"
          >
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("ure:accept-offer"))}
            className="flex flex-col items-center justify-center gap-0.5 bg-amber-500 px-1 py-2.5 text-[10px] font-extrabold leading-tight text-white active:bg-amber-600"
          >
            <Truck className="h-5 w-5" />
            Accept Offer &amp; Schedule Pickup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-2 pb-safe">
        <a
          href={telLink()}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold text-slate-600 active:text-brand-700"
        >
          <Phone className="h-5 w-5" /> Call Now
        </a>
        <a
          href={waLink(MSG)}
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center justify-center gap-1 border-l border-slate-100 py-2.5 text-[11px] font-bold text-emerald-600"
        >
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 lg:flex">
      <a
        href={telLink()}
        aria-label="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 transition-transform hover:scale-110"
      >
        <Phone className="h-7 w-7" />
      </a>
      <a
        href={waLink(MSG)}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110"
      >
        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-[#25D366]/60" />
        <WhatsAppIcon className="relative h-8 w-8" />
      </a>
    </div>
  );
}
