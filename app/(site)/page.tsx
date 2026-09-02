import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import SellBanner from "@/components/home/SellBanner";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import GoogleReviews from "@/components/home/GoogleReviews";
import Faq from "@/components/home/Faq";
import BlogPreview from "@/components/home/BlogPreview";
import ServiceAreas from "@/components/home/ServiceAreas";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/config";
import { FAQS } from "@/lib/content";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE.name,
  image: `${SITE.url}/icon.svg`,
  url: SITE.url,
  telephone: SITE.phone,
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line1}, ${SITE.address.area}`,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    postalCode: SITE.address.pin,
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHours: "Mo-Su 08:00-21:00",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.ratingValue,
    reviewCount: SITE.reviewCount,
    bestRating: "5",
  },
  areaServed: SITE.address.city,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusiness} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <HowItWorks />
      <SellBanner />
      <WhyUs />
      <Testimonials />
      <GoogleReviews />
      <ServiceAreas />
      <Faq />
      <BlogPreview />
    </>
  );
}
