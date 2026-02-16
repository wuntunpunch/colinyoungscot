import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import BurgerMenu from "@/components/BurgerMenu";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Colin Young - Business Process Streamlining & Custom Web Apps | West Scotland",
  description:
    "Custom booking systems, process streamlining, and web apps that replace manual admin. Building tools for businesses across West Scotland.",
  openGraph: {
    title: "Colin Young - Business Process Streamlining & Custom Web Apps | West Scotland",
    description:
      "Custom booking systems, process streamlining, and web apps that replace manual admin. Building tools for businesses across West Scotland.",
    type: "website",
    siteName: "colinyoung.scot",
    images: [
      {
        url: "https://colinyoung.scot/colinyoungscot-og.png",
        width: 1200,
        height: 630,
        alt: "Colin Young - Platform engineer, piano teacher and business process streamliner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colin Young - Business Process Streamlining & Custom Web Apps | West Scotland",
    description:
      "Custom booking systems, process streamlining, and web apps that replace manual admin. Building tools for businesses across West Scotland.",
    images: ["https://colinyoung.scot/colinyoungscot-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Colin Young",
    url: "https://colinyoung.scot",
    description:
      "Custom booking systems, process streamlining, and web apps that replace manual admin. Building tools for businesses across West Scotland.",
    areaServed: {
      "@type": "Place",
      name: "West Scotland",
    },
    serviceType: [
      "Business process automation",
      "Custom booking systems",
      "Web applications",
    ],
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased flex flex-col min-h-screen`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
        <BurgerMenu />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
