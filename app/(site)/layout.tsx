import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContacts from "@/components/layout/FloatingContacts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingContacts />
    </>
  );
}
