export interface BlogSection {
  h: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  emoji: string;
  gradient: string;
  intro: string;
  sections: BlogSection[];
  conclusion: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ac-not-cooling-checklist",
    title: "AC Not Cooling? 7 Checks Before You Call a Technician",
    excerpt:
      "Save time and money — run through this simple checklist before booking an AC repair visit. You might fix it yourself in minutes.",
    date: "2026-07-18",
    readMins: 4,
    emoji: "❄️",
    gradient: "from-sky-100 to-blue-200",
    intro:
      "A split AC that blows warm air is one of the most common complaints we get. Before you book a service visit, run through these seven quick checks — many 'broken' ACs just need a reset, a filter clean or a thermostat tweak.",
    sections: [
      {
        h: "1. Check the thermostat mode and temperature",
        body: "It sounds obvious, but confirm the remote is on COOL mode (snowflake icon), not FAN or DRY. Set temperature at least 3–4°C below room temperature. If someone changed the mode to heat by mistake, the AC will never cool.",
      },
      {
        h: "2. Clean or replace the air filters",
        body: "Clogged filters choke airflow and can cut cooling by up to 40%. Open the front panel, slide out the mesh filters and rinse them under tap water. Let them dry fully before re-inserting. Do this every 2–3 weeks in peak summer.",
      },
      {
        h: "3. Inspect the outdoor unit",
        body: "The outdoor condenser needs free airflow. Clear leaves, dust, plastic bags or any object within 2 feet of it. Gently hose down the fins (power off first). A dirty outdoor unit is the #1 cause of weak cooling.",
      },
      {
        h: "4. Look for ice on the indoor coil",
        body: "Open the front panel and check the evaporator coils. Ice build-up means low refrigerant or a blocked filter. Turn the AC off but leave the fan ON for an hour to melt the ice, then re-test.",
      },
      {
        h: "5. Reset the circuit breaker",
        body: "Compressors sometimes trip the breaker during voltage spikes. Switch the MCB off for 2 minutes and back on. If it trips repeatedly, stop and call us — that points to an electrical fault needing expert attention.",
      },
      {
        h: "6. Check for air leaks",
        body: "Gaps around the indoor unit's drain pipe hole or open windows let hot air in and kill performance. Seal visible gaps with insulation tape and keep the room closed while running.",
      },
      {
        h: "7. Note the age of your last gas service",
        body: "If it has been over 1–2 years since your last gas top-up or deep cleaning, refrigerant may be low. This is not DIY territory — refilling without fixing the leak wastes money.",
      },
    ],
    conclusion:
      "If none of these restore cooling, the issue is likely refrigerant leakage, compressor health or PCB failure — all quick fixes for our certified technicians. Book online in under a minute and we'll usually reach you the same day.",
  },
  {
    slug: "refrigerator-maintenance-tips",
    title: "10 Refrigerator Maintenance Tips That Cut Your Electricity Bill",
    excerpt:
      "Your fridge runs 24×365. These ten habits keep it efficient, extend compressor life and quietly shave hundreds off your monthly bill.",
    date: "2026-06-30",
    readMins: 5,
    emoji: "🧊",
    gradient: "from-cyan-100 to-sky-200",
    intro:
      "The refrigerator is the hardest-working appliance in your kitchen — and often the most ignored until something goes wrong. Follow these ten habits to keep it humming efficiently for years.",
    sections: [
      {
        h: "Keep it away from heat sources",
        body: "Never place your fridge next to the oven, stove or direct sunlight. Heat forces the compressor to work harder, raising both wear and power consumption. Leave at least 3 inches of gap behind and above the unit for ventilation.",
      },
      {
        h: "Set the right temperature",
        body: "Fridge compartment at 4°C and freezer at -18°C is ideal. Colder settings waste electricity without improving food safety.",
      },
      {
        h: "Let hot food cool first",
        body: "Placing steaming pots inside raises internal temperature and makes the compressor sprint. Cool covered dishes to room temperature before storing.",
      },
      {
        h: "Don't overpack — or under-pack",
        body: "Air needs to circulate inside. Keep the fridge about 70–80% full; cold items actually help retain temperature, but blocking vents causes uneven cooling and frost.",
      },
      {
        h: "Check the door gasket yearly",
        body: "Close the door on a ₹10 note — if it slides out easily, your gasket is leaking cold air. Replace worn gaskets promptly; they're inexpensive and pay for themselves in weeks.",
      },
      {
        h: "Clean the condenser coils twice a year",
        body: "Dust on the back/bottom coils acts like a blanket. Unplug, then brush or vacuum the coils gently. This single step can improve efficiency by up to 15%.",
      },
      {
        h: "Defrost before 5mm of frost builds up",
        body: "For direct-cool models, excess frost insulates the freezer and strains the motor. Defrost when frost exceeds about half a centimetre — never chip it with sharp objects.",
      },
      {
        h: "Use a stabiliser in unstable-voltage areas",
        body: "Voltage fluctuations silently kill compressors. A good stabiliser costs less than 2% of a new fridge and protects it for years.",
      },
      {
        h: "Vacation mode matters",
        body: "Going away for weeks? Empty it, switch to vacation mode (or set warmer), and leave the door slightly ajar if switching off entirely to prevent mould odours.",
      },
      {
        h: "Listen to your fridge",
        body: "New buzzing, clicking or gurgling sounds are early warnings of compressor or fan issues. Catching them early turns a ₹800 fix into avoiding a ₹8,000 compressor replacement.",
      },
    ],
    conclusion:
      "Notice weak cooling, frost build-up or strange noises anyway? Our doorstep refrigerator service starts at ₹349 with genuine parts and a service warranty — booked in under 60 seconds. And if your old fridge has served its time, get an instant buyback offer worth checking out.",
  },
  {
    slug: "sell-old-ac-best-price-guide",
    title: "Selling Your Old AC or Fridge? How to Get the Best Price",
    excerpt:
      "Scrap dealers, online classifieds, exchange programs, professional buyback — here's exactly how each option pays, and how to walk away with more money.",
    date: "2026-06-12",
    readMins: 6,
    emoji: "💰",
    gradient: "from-amber-100 to-orange-200",
    intro:
      "That old window AC or single-door fridge still has real value — typically ₹1,000–₹9,000 depending on model, capacity and condition. Where you sell it decides whether you capture that value or give most of it away.",
    sections: [
      {
        h: "Know what your appliance is worth",
        body: "Buyback value depends mainly on four factors: type & capacity (a 1.5-ton inverter AC beats a 1-ton), brand reputation, working condition, and age (under 5 years commands a strong premium). Get a data-backed estimate instead of guessing — our live estimator uses current market scrap and resale rates.",
      },
      {
        h: "Option 1: Local scrap dealer — fastest, lowest",
        body: "Convenient, cash-on-spot, zero paperwork. But dealers price almost purely on scrap metal weight, so you'll typically receive 40–60% of true resale value. Use only as a last resort.",
      },
      {
        h: "Option 2: Online classifieds — highest ceiling, most effort",
        body: "Listing on OLX/Facebook Marketplace can fetch great prices if your appliance works well. But factor in: weeks of waiting, dozens of calls, no-show buyers, and negotiation fatigue. Best for patient sellers of premium models.",
      },
      {
        h: "Option 3: Brand exchange — convenient but capped",
        body: "Exchange offers while buying new appliances are effortless, but values are conservative and often locked to specific new purchases. Read the fine print: some inflate the new product's price to fund the discount.",
      },
      {
        h: "Option 4: Professional buyback — balanced best",
        body: "Services like ours combine market-linked pricing (typically up to 20% above standard exchange), free doorstep pickup, instant UPI payment, and proper disposal documentation. The sweet spot for most people.",
      },
      {
        h: "Prep tips that add real money",
        body: "Locate the model sticker (usually inside the fridge door frame or on the AC's side panel) — knowing the exact model prevents lowball quotes. Take clear photos including the sticker. Mention working accessories like remotes and stands. For non-working units, be honest — we still pay competitive scrap-plus value.",
      },
      {
        h: "Red flags when selling",
        body: "Never hand over the appliance before receiving full payment. Avoid 'inspection charges'. Be cautious of buyers demanding OTPs — classic payment fraud. Reputable services pay first, then lift.",
      },
    ],
    conclusion:
      "Ready to convert your old appliance into money? Answer six questions, upload photos, and see your estimated offer instantly — free pickup scheduled at your convenience, payment on the spot.",
  },
  {
    slug: "geyser-care-winter",
    title: "Winter Is Coming: Get Your Geyser Ready in 15 Minutes",
    excerpt:
      "Cold-water shock in December is preventable. Here's the pre-winter geyser routine our technicians recommend for safety, savings and hot showers.",
    date: "2026-05-28",
    readMins: 3,
    emoji: "🚿",
    gradient: "from-orange-100 to-red-200",
    intro:
      "Geysers fail predictably — right after months of idle storage, on the coldest morning of the year. A 15-minute pre-winter check prevents 90% of those emergency calls.",
    sections: [
      {
        h: "Test-run before you need it",
        body: "In October, run the heater once for 15 minutes. No heating, tripping MCB, or leaking? Better to discover it in pleasant weather than on a freezing Monday morning.",
      },
      {
        h: "Check the pressure release valve",
        body: "Lift the lever on the safety valve briefly — water should flow from the overflow pipe. If nothing comes out, the valve may be jammed, which is a serious safety risk. Get it replaced immediately.",
      },
      {
        h: "Descale the tank annually",
        body: "Hard water areas coat heating elements with scale, slowing heating and inflating bills by up to 20%. Professional descaling restores efficiency and extends element life dramatically.",
      },
      {
        h: "Inspect pipes and wiring",
        body: "Look for rust streaks, green-white corrosion on connections, or cracked insulation on wires. Any of these warrant a professional visit before daily use begins.",
      },
      {
        h: "Set the thermostat sensibly",
        body: "50–60°C is plenty for bathing. Every extra degree adds cost and scalding risk, plus faster scale formation.",
      },
    ],
    conclusion:
      "Spotting trouble or want a pre-winter professional checkup? Geyser service starts at ₹349 with installation-grade safety checks included. Stay warm!",
  },
];
