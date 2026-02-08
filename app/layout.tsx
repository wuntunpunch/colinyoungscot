import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BurgerMenu from "@/components/BurgerMenu";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Colin Young - Platform Engineer & Piano Teacher",
  description: "Platform engineer by day, piano teacher by night. I create web apps and mobile apps, and work with businesses to help streamline processes and build custom-made applications.",
  openGraph: {
    title: "Colin Young - Platform Engineer & Piano Teacher",
    description: "Platform engineer by day, piano teacher by night. I create web apps and mobile apps, and work with businesses to help streamline processes and build custom-made applications.",
    type: "website",
    siteName: "colinyoung.scot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colin Young - Platform Engineer & Piano Teacher",
    description: "Platform engineer by day, piano teacher by night. I create web apps and mobile apps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <GoogleAnalytics />
        <BurgerMenu />
        {children}
      </body>
    </html>
  );
}
