"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { telLink, waLink } from "@/lib/utils";

const MSG = "Hi Urban Repair Expert! I want to book a repair service.";

export default function FloatingContacts() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/technician")) return null;

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-center gap-2.5">
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
