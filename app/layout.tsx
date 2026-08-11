import type { Metadata } from "next";
import { Instrument_Serif, Fraunces } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Schema from "@/components/Schema";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com"
  ),
  title: {
    default: "Smart Water Shutoff Installation Houston | HydroSense Texas",
    template: "%s | HydroSense Texas",
  },
  description:
    "Professional whole-home leak detection and automatic water shutoff installation across Greater Houston. Device setup, shutoff testing, homeowner handoff, and installation records. Call (281) 694-5754.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Smart Water Shutoff Installation Houston | HydroSense Texas",
    description:
      "Professional whole-home smart water shutoff installation, configuration, testing, and handoff across Greater Houston.",
    url: "https://hydrosensetx.com",
    siteName: "HydroSense Texas",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HydroSense Texas smart water shutoff installation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Water Shutoff Installation Houston | HydroSense Texas",
    description:
      "Professional installation, app setup, shutoff testing, and homeowner handoff across Greater Houston.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "761yTR0D67eaCnkpzqLtis59VqJzCZfdHq-sMeeFx78",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Schema />
        {children}
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
