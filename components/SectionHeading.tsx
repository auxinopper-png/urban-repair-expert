import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  light,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <Reveal className={cn("mb-10 lg:mb-14", align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest",
            light ? "bg-white/10 text-brand-300" : "bg-brand-50 text-brand-700"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance text-[26px] font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-[40px]",
          light ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={cn(
            "mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed",
            light ? "text-slate-300" : "text-slate-500",
            align === "left" && "!mx-0"
          )}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
