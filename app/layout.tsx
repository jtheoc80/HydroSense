import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Analytics from "@/components/Analytics";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HydroSense | Texas Smart Water Shutoff Installs — Save $300-$600/yr on Insurance",
  description:
    "Licensed Texas RMP installs a carrier-recognized smart water shutoff valve and issues the certificate your insurer needs to apply a 5-15% homeowners discount. Most homeowners earn back the install inside 24 months.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com"
  ),
  openGraph: {
    title: "HydroSense | Stop Leaving $500/yr on the Table",
    description:
      "Texas home insurance is up 46% in two years. A certified smart water shutoff install qualifies you for $300-$600 in annual credits most homeowners never collect.",
    url: "https://hydrosensetx.com",
    siteName: "HydroSense",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HydroSense | Texas Smart Water Shutoff Installs",
    description:
      "Save $300-$600/yr on Texas homeowners insurance with a certified smart shutoff install.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
