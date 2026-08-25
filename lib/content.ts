export interface Testimonial {
  name: string;
  area: string;
  service: string;
  text: string;
  stars: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    area: "Borabanda",
    service: "AC Repair",
    text: "AC stopped cooling at 10 AM, technician arrived by 1 PM the same day. Gas refilled with genuine parts and 3 months warranty. Very professional!",
    stars: 5,
  },
  {
    name: "Rahul Verma",
    area: "Ameerpet",
    service: "Sold Old Fridge",
    text: "Got ₹1,850 more than Flipkart's exchange offer for my old double-door fridge. Free pickup from my doorstep and instant UPI payment. Zero hassle.",
    stars: 5,
  },
  {
    name: "Amit Gupta",
    area: "Kukatpally",
    service: "Washing Machine",
    text: "Booked in literally 60 seconds on WhatsApp. The technician diagnosed the drain motor issue, fixed it on the spot, and shared before/after photos.",
    stars: 5,
  },
  {
    name: "Sneha Patel",
    area: "Madhapur",
    service: "Geyser Repair",
    text: "Water heater was leaking badly. They came within 2 hours, replaced the element, and charged exactly what was quoted. Transparent pricing is rare these days.",
    stars: 5,
  },
  {
    name: "Vikram Singh",
    area: "Gachibowli",
    service: "AC Service",
    text: "Deep cleaning of 2 split ACs. Jet spray wash, foam coil cleaner, proper checklist, invoice on WhatsApp. My electricity bill dropped noticeably.",
    stars: 5,
  },
  {
    name: "Neha Joshi",
    area: "Somajiguda",
    service: "Refrigerator Repair",
    text: "Compressor issue fixed under diagnosis. Loved the live status updates — booked, assigned, on the way — all tracked like a cab app. Premium experience.",
    stars: 5,
  },
];

export const FAQS = [
  {
    q: "How quickly can a technician reach me?",
    a: "In most service areas we offer same-day visits when you book before 5 PM. Morning slots often get a technician within 2–4 hours. You'll receive live status updates — assigned, on the way — just like tracking a cab.",
  },
  {
    q: "What are your charges? Is there a visiting fee?",
    a: "Repairs start at just ₹349. Diagnosis is adjusted into your final repair bill if you proceed with the fix. No hidden charges — the technician confirms the exact price before starting any work.",
  },
  {
    q: "Do you provide a service warranty?",
    a: "Every repair carries a written 180-day warranty on the specific fault we fix, and genuine spare parts carry manufacturer warranty. Warranty covers workmanship and replaced parts; physical damage, liquid ingress or third-party tampering are excluded. Full terms are printed on your digital invoice.",
  },
  {
    q: "Are the spare parts genuine?",
    a: "Absolutely. We source OEM / genuine spare parts and share the replaced part with you after the job, along with its warranty card where applicable.",
  },
  {
    q: "How does selling my old AC or refrigerator work?",
    a: "Answer 6 quick questions (appliance → brand → model → capacity → age → condition), upload photos, and instantly see your estimated offer — typically up to 20% higher than standard exchange values. Book a free pickup; our inspector does a final check at your door and payment is instant via UPI or cash.",
  },
  {
    q: "Is the sell price shown final?",
    a: "The online value is a fair estimate based on your appliance's model, age and condition. The final offer depends on physical inspection at pickup — and our offers stay among the best in the market.",
  },
  {
    q: "When do I pay? Do you accept cards or UPI?",
    a: "You inspect the work first — pay only after the job is completed to your satisfaction. We accept UPI, cards and cash. You receive a proper GST invoice on WhatsApp and email with warranty terms printed on it. No advance payment for standard repairs.",
  },
  {
    q: "Which areas do you serve?",
    a: "We currently serve across Hyderabad — Borabanda, Ameerpet, Kukatpally, Madhapur, Gachibowli & nearby colonies. Enter your pin code while booking — if your area isn't listed, ping us on WhatsApp and we'll try to arrange a visit.",
  },
];

export const WHY_US = [
  { title: "Same-Day Service", desc: "Book before 5 PM and get expert help today — not tomorrow.", icon: "zap" },
  { title: "Doorstep Convenience", desc: "No shop visits, no carrying appliances. We come fully equipped.", icon: "home" },
  { title: "Genuine Spare Parts", desc: "OEM parts with warranty. Old parts handed back to you.", icon: "shield" },
  { title: "180-Day Warranty", desc: "Every repair backed by written warranty on workmanship.", icon: "badge" },
  { title: "Transparent Pricing", desc: "Exact quote approved by you before work starts. No surprises.", icon: "tag" },
  { title: "Verified Experts", desc: "Background-checked, uniformed technicians with 8+ yrs avg. experience.", icon: "user" },
];
