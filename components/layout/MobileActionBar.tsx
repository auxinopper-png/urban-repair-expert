"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Wrench } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telLink, waLink } from "@/lib/utils";

const MSG = "Hi Urban Repair Expert! I want to book a repair service.";

export default function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  const onSell = pathname === "/sell";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-3 pb-safe">
        <a
          href={telLink()}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold text-slate-600 active:text-brand-700"
        >
          <Phone className="h-5 w-5" /> Call Now
        </a>
        <a
          href={waLink(MSG)}
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center gap-1 border-x border-slate-100 py-2.5 text-[11px] font-bold text-emerald-600"
        >
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
        <Link
          href={onSell ? "/book" : "/sell"}
          className="flex flex-col items-center gap-1 bg-brand-600 py-2.5 text-[11px] font-bold text-white active:bg-brand-700"
        >
          <Wrench className="h-5 w-5" />
          {onSell ? "Book Repair" : "Get Offer"}
        </Link>
      </div>
    </div>
  );
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;
  return (
    <a
      href={waLink(MSG)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-emerald-500/30 transition hover:scale-105 lg:flex"
    >
      <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-[#25D366]/60" />
      <WhatsAppIcon className="relative h-8 w-8 text-white" />
    </a>
  );
}
