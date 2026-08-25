"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Wrench,
  Snowflake,
  IndianRupee,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/admin";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Repair Bookings", icon: Wrench },
  { href: "/admin/sell", label: "Sell Requests", icon: Snowflake },
  { href: "/admin/pricing", label: "Price Engine", icon: IndianRupee },
  { href: "/admin/technicians", label: "Technicians", icon: Users },
];

export default function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition",
              active
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <l.icon className="h-5 w-5 shrink-0" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 bg-slate-950 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo light />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open ? (
          <nav className="border-t border-white/10 p-3">{nav}</nav>
        ) : null}
      </div>

      <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="mb-8 rounded-2xl bg-white p-2.5">
          <Logo />
        </div>
        {nav}
        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <p className="truncate text-xs font-bold text-white">{name}</p>
          <p className="text-[11px] text-slate-400">Administrator</p>
          <form action={signOut} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-rose-500 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
