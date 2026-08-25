export const SITE = {
  name: "Urban Repair Expert",
  shortName: "URE",
  tagline: "Expert appliance repair & buyback at your doorstep",
  description:
    "Same-day doorstep repair for AC, refrigerator, washing machine & geyser in Hyderabad. Sell your old AC or refrigerator at the best price with free pickup and instant payment.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://urbanrepairexpert.in",
  phone: "+918109279412",
  phoneDisplay: "+91 81092 79412",
  whatsapp: "918109279412",
  email: "experturban56@gmail.com",
  address: {
    line1: "Main Road, Borabanda",
    area: "Borabanda",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500018",
    country: "IN",
  },
  hours: "Open all days · 8:00 AM – 9:00 PM",
  geo: { lat: 17.4453, lng: 78.454 },
  ratingValue: "4.9",
  reviewCount: "128",
  yearsExperience: "5",
  repairsDone: "5000",
  googleReviewsUrl: "#",
  socials: {
    instagram: "#",
    facebook: "#",
    youtube: "#",
  },
};

export const SERVICE_AREAS = [
  "Borabanda", "Somajiguda", "Ameerpet", "S R Nagar", "Punjagutta",
  "Banjara Hills", "Jubilee Hills", "Erragadda", "Sanath Nagar", "Balkampet",
  "Yousufguda", "Khairatabad", "Begumpet", "Kukatpally", "KPHB Colony",
  "Madhapur", "Hitech City", "Gachibowli", "Miyapur", "Srinagar Colony",
];

export const STARTING_PRICES: Record<string, number> = {
  ac: 499,
  refrigerator: 349,
  washing_machine: 399,
  geyser: 349,
};

export const TIME_SLOTS = ["9 AM – 12 PM", "12 PM – 3 PM", "3 PM – 6 PM", "6 PM – 9 PM"];
