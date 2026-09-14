import "./globals.css";
import { DataProvider } from "@/lib/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyBanner from "@/components/EmergencyBanner";
import PromoPopup from "@/components/PromoPopup";

export const metadata = {
  title: "jvmmedicalservices — JVM Medical Services · Neonatology, Pediatrics & USCE Training",
  description:
    "JVM Medical Services provides board-certified neonatal and pediatric clinical education, tele-rotations, USMLE question banks, and research mentorship led by Dr. Janardhan Mydam, MD, FAAP.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DataProvider>
          <EmergencyBanner />
          <a href="#main" className="skip-link">Skip to content</a>
          <Navbar />
          <div className="promo-strip">
            <div className="container" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pill accent">Free Practice</span>
              <span>Free board-style clinical reasoning mock tests &amp; tele-rotations in neonatology and pediatrics.</span>
            </div>
          </div>
          <main id="main">{children}</main>
          <PromoPopup />
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
