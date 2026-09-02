import "./globals.css";
import { DataProvider } from "@/lib/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dr. Janardhan Mydam — Free Consultations · Neonatology & Pediatrics Mentorship",
  description:
    "Free phone consultations, student mentorship, research and rotations in neonatology and pediatrics — from India to the world.",
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
          <a href="#main" className="skip-link">Skip to content</a>
          <Navbar />
          <div className="promo-strip">
            <div className="container">
              <span className="pill">Free</span>
              <span>Every consultation is free — this site exists to record and share the impact, not to charge for it.</span>
            </div>
          </div>
          <main id="main">{children}</main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
