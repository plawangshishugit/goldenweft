import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppCTA from "@/components/whatsapp/FloatingWhatsAppCTA";
import RevealObserver from "@/components/RevealObserver";

/* ── Cormorant as the display serif ── */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",   /* maps to Tailwind `font-serif` + CSS var */
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/* ── Inter as the utility sans ── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "GoldenWeft — Handwoven Bhagalpuri Silks",
  description:
    "Exquisite handwoven silks from Bhagalpur, India. Tussar, Ghicha & Mulberry silks crafted across generations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsAppCTA />
        <RevealObserver />
      </body>
    </html>
  );
}
