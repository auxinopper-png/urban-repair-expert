import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Urban Repair Expert",
    short_name: "URE",
    description:
      "Same-day doorstep appliance repair & best-price buyback for old ACs and refrigerators.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e56d9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
