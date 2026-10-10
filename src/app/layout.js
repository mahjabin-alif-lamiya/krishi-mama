import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata = {
  title: "Krishi Mama (কৃষি মামা) — NASA Space Apps Challenge 2026 | Team MindMesh",
  description:
    "A climate decision-support tool that evaluates the risk of delaying sowing by 0, 7, or 14 days for Bangladeshi farmers using 25 years of NASA POWER meteorological data.",
  keywords: [
    "Krishi Mama",
    "NASA Space Apps 2026",
    "MindMesh",
    "NASA POWER",
    "Crop Planting Window",
    "Bangladesh Agriculture",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansBengali.variable}`}
    >
      <head>
        {/* Inline script to prevent theme flash before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem("krishi_theme");var theme=stored||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            {/* Global Navbar rendered ONLY in RootLayout */}
            <Navbar />

            <main className="flex-1 flex flex-col">
              {children}
            </main>

            {/* Global Footer rendered ONLY in RootLayout */}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
