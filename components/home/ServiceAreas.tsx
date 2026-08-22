import { MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SERVICE_AREAS } from "@/lib/config";

export default function ServiceAreas() {
  return (
    <section className="bg-slate-50 py-14 lg:py-20">
      <div className="wrap text-center">
        <Reveal>
          <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Proudly serving your neighbourhood
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Same-day doorstep service across these areas and nearby localities.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-2">
            {SERVICE_AREAS.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-500" />
                {a}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
