import { cn } from "@/lib/utils";

export default function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#3673f2" />
            <stop offset="100%" stopColor="#1a44b4" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill="url(#lg1)" />
        <path
          d="M31.4 15.2a4.6 4.6 0 0 0-6.5 6.1L14.6 31.6a2.6 2.6 0 1 0 3.7 3.7l10.3-10.3a4.6 4.6 0 0 0 6.1-6.5l-3.4 3.4-3.5-.9-.9-3.5 3.5-2.3z"
          fill="#fff"
        />
        <circle cx="33" cy="33" r="4" fill="#ffb020" />
        <path d="M33 30.6v4.8M30.6 33h4.8" stroke="#1a44b4" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className={cn("leading-tight", light ? "text-white" : "text-slate-900")}>
        <span className="block text-[17px] font-extrabold tracking-tight">Urban Repair</span>
        <span
          className={cn(
            "block -mt-0.5 text-[11px] font-bold uppercase tracking-[0.22em]",
            light ? "text-brand-300" : "text-brand-600"
          )}
        >
          Expert
        </span>
      </span>
    </span>
  );
}
