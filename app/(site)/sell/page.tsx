import type { Metadata } from "next";
import SellWizard from "@/components/sell/SellWizard";
import { getPricingTree } from "@/lib/pricing-data";

export const metadata: Metadata = {
  title: "Sell Old AC & Refrigerator Online — Best Price, Free Pickup",
  description:
    "Get up to 20% higher value than standard exchange offers for your old AC or refrigerator. Live price estimation, free doorstep pickup, instant payment.",
  alternates: { canonical: "/sell" },
};

export const dynamic = "force-dynamic";

export default async function SellPage() {
  const tree = await getPricingTree();

  return (
    <section className="bg-gradient-to-b from-amber-50/60 via-white to-white py-10 lg:py-16">
      <div className="wrap">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-800">
            Premium Buyback
          </span>
          <h1 className="mt-4 text-balance text-[28px] font-extrabold tracking-tight sm:text-4xl">
            Sell your old appliance in{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              90 seconds
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-slate-500">
            Answer 6 quick questions and see your instant estimated offer — free pickup, payment on
            the spot.
          </p>
        </div>

        <SellWizard tree={tree} />
      </div>
    </section>
  );
}
