"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Truck, Wrench } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telLink, waLink } from "@/lib/utils";

const MSG = "Hi Urban Repair Expert! I want to book a repair service.";

export default function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  if (pathname === "/sell") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("ure:accept-offer"))}
          className="flex w-full items-center justify-center gap-2 bg-amber-500 py-3 text-[13px] font-extrabold text-white active:bg-amber-600 pb-safe"
        >
          <Truck className="h-5 w-5" />
          Accept Offer &amp; Schedule Pickup
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
      <Link
        href="/sell"
        className="flex w-full items-center justify-center gap-2 bg-brand-600 py-3 text-[13px] font-extrabold text-white active:bg-brand-700 pb-safe"
      >
        <Wrench className="h-5 w-5" /> Get Offer — Sell Old Appliance
      </Link>
    </div>
  );
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-center gap-3 lg:bottom-6 lg:right-6">
      <a
        href={telLink()}
        aria-label="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 transition-transform hover:scale-110 active:scale-95"
      >
        <Phone className="h-7 w-7" />
      </a>
      <a
        href={waLink(MSG)}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
      >
        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-[#25D366]/60" />
        <WhatsAppIcon className="relative h-8 w-8" />
      </a>
    </div>
  );
}
