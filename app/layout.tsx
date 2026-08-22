import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { SITE } from "@/lib/config";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — AC, Refrigerator & Appliance Repair + Old Appliance Buyback`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "ac repair near me",
    "refrigerator repair",
    "washing machine repair",
    "geyser repair",
    "sell old ac",
    "sell old refrigerator",
    "ac gas refill",
    "doorstep appliance repair",
    "old ac buyback",
    SITE.address.city.toLowerCase() + " ac repair",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Same-Day Appliance Repair & Best-Price Buyback`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e56d9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
