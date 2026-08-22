"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import SectionHeading from "@/components/SectionHeading";
import { FAQS } from "@/lib/content";
import { waLink } from "@/lib/utils";
import { SITE } from "@/lib/config";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50 py-16 lg:py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="FAQs"
          title="Questions? Answered."
          sub="Everything customers ask before booking. Still unsure — ping us on WhatsApp."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl border bg-white transition ${
                  isOpen ? "border-brand-200 shadow-card" : "border-slate-100"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-bold text-slate-900">{f.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? "rotate-180 bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-[14px] leading-relaxed text-slate-500">
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-center text-white">
            <p className="font-bold">Still have a question?</p>
            <p className="mt-1 text-sm text-brand-100">
              We reply within minutes during working hours.
            </p>
            <a
              href={waLink(`Hi ${SITE.name}! I have a question.`)}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
