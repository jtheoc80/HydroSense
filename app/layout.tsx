import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Schema from "@/components/Schema";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "HydroSense Texas | Smart Water Shutoff Installs, $300-$600/yr Insurance Credit",
  description:
    "Texas Master Plumber installed smart water shutoff with carrier-recognized certification. 5-15% homeowners insurance discount. Install from $999. License MPL 43057.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com"
  ),
  alternates: {
    canonical: "https://hydrosensetx.com",
  },
  openGraph: {
    title: "HydroSense Texas | Stop Leaving $500/yr on the Table",
    description:
      "Texas home insurance is up 46% in two years. A certified smart water shutoff install qualifies you for $300-$600 in annual credits most homeowners never collect.",
    url: "https://hydrosensetx.com",
    siteName: "HydroSense Texas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HydroSense Texas | Smart Water Shutoff Installs",
    description:
      "Save $300-$600/yr on Texas homeowners insurance with a certified smart shutoff install. License MPL 43057.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Schema />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
