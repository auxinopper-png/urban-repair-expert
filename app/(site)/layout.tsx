import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileActionBar, {
  FloatingWhatsApp,
} from "@/components/layout/MobileActionBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-[76px] lg:pb-0">{children}</main>
      <Footer />
      <MobileActionBar />
      <FloatingWhatsApp />
    </>
  );
}
