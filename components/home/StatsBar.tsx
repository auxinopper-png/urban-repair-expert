"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/config";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: parseInt(SITE.repairsDone), suffix: "+", label: "Repairs Completed" },
  { value: parseFloat(SITE.ratingValue), suffix: "", label: "Google Rating", star: true },
  { value: 60, suffix: "s", label: "To Book Online" },
  { value: 90, suffix: "-Day", label: "Service Warranty" },
];

export default function StatsBar() {
  return (
    <section className="wrap -mt-2 lg:-mt-6">
      <Reveal>
        <div className="grid grid-cols-2 gap-3 rounded-[28px] border border-slate-100 bg-white p-5 shadow-card sm:p-7 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="flex items-center justify-center gap-1 text-2xl font-extrabold tracking-tight text-brand-700 sm:text-3xl">
                <Counter to={s.value} suffix={s.suffix} />
                {s.star ? <Star className="h-5 w-5 fill-amber-400 text-amber-400" /> : null}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
