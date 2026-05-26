import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Noto_Serif_Sinhala, Maname } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala", "latin"],
  variable: "--font-noto-serif-sinhala",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const maname = Maname({
  subsets: ["sinhala", "latin"],
  variable: "--font-maname",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "වෙසක් ප්‍රභා - Share the Light | Digital Vesak Cards",
  description:
    "Create and share beautiful personalized digital Vesak greeting cards. Choose from curated templates, add your message in Sinhala or English, and share the light with loved ones.",
  keywords: [
    "Vesak",
    "Vesak cards",
    "digital greeting cards",
    "Sri Lanka",
    "Buddhist",
    "වෙසක්",
    "Vesak 2026",
    "Fuchsia Labs",
  ],
  authors: [{ name: "Fuchsia Labs", url: "https://fuchsialabs.xyz" }],
  openGraph: {
    title: "වෙසක් ප්‍රභා - Share the Light",
    description:
      "Create beautiful personalized digital Vesak greeting cards and share them with loved ones.",
    siteName: "වෙසක් ප්‍රභා",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "වෙසක් ප්‍රභා - Share the Light",
    description: "Create beautiful personalized digital Vesak greeting cards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${notoSerifSinhala.variable} ${maname.variable} font-sans antialiased relative min-h-screen bg-bg-primary text-text-primary`}
      >
        {/* Global Festive Background Pattern */}
        <div 
          className="fixed inset-0 bg-cover bg-center opacity-[0.1] pointer-events-none mix-blend-lighten z-0"
          style={{ backgroundImage: "url('/vesak-bg.png')" }}
        />
        {/* Ambient glowing circles */}
        <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-pink/5 blur-[120px] pointer-events-none z-0" />
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-gold/3 blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
