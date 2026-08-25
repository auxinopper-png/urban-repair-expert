"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Wrench } from "lucide-react";
import Logo from "@/components/Logo";
import { SITE } from "@/lib/config";
import { telLink } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book Repair" },
  { href: "/sell", label: "Sell Old Appliance" },
  { href: "/rates", label: "Rate Card" },
  { href: "/track", label: "Track Booking" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <div className="bg-slate-950 text-white">
        <div className="wrap flex h-9 items-center justify-between text-[12.5px] font-medium">
          <p className="flex items-center gap-1.5">
            Same-Day Doorstep Service · {SITE.hours.split("·")[0].trim()}
          </p>
          <a
            href={telLink()}
            className="hidden items-center gap-1.5 hover:text-brand-300 sm:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 shadow-card backdrop-blur-xl" : "bg-white"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between lg:h-[72px]">
          <Link href="/" aria-label={SITE.name}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3.5 py-2 text-[14.5px] font-semibold transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={telLink()}
              className="btn-outline hidden !px-4 !py-2.5 !text-sm md:inline-flex"
              aria-label="Call now"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <Link href="/book" className="btn-primary hidden !px-5 !py-2.5 !text-sm sm:inline-flex">
              <Wrench className="h-4 w-4" /> Book Service
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-slate-100 bg-white pb-4 lg:hidden">
            <nav className="wrap flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3.5 text-[15px] font-semibold ${
                    pathname === item.href
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 active:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 px-4">
                <a href={telLink()} className="btn-outline flex-1 !py-3">
                  <Phone className="h-4 w-4" /> Call
                </a>
                <Link href="/book" className="btn-primary flex-1 !py-3">
                  <Wrench className="h-4 w-4" /> Book Now
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
