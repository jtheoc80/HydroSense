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
  title:
    "HydroSense Texas | Smart Water Shutoff Installs, $300-$600/yr Insurance Credit",
  description:
    "Licensed smart water shutoff installs, Texas Master Plumber certified. Carrier-recognized certification. 5-15% homeowners insurance discount. Install from $999.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com"
  ),
  alternates: {
    canonical: "https://hydrosensetx.com",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "HydroSense Texas | Stop Leaving $600/yr on the Table",
    description:
      "Texas home insurance is up 46% in two years. A certified smart water shutoff install qualifies you for $300-$600 in annual credits most homeowners never collect.",
    url: "https://hydrosensetx.com",
    siteName: "HydroSense Texas",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HydroSense Texas - Smart Home Water Defense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HydroSense Texas | Smart Water Shutoff Installs",
    description:
      "Save $300-$600/yr on Texas homeowners insurance with a certified smart shutoff install. Licensed Texas Master Plumber.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: "761yTR0D67eaCnkpzqLtis59VqJzCZfdHq-sMeeFx78",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
