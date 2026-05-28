import type { Metadata } from "next";
import BookingEmbed from "./BookingEmbed";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Book Your 15-Minute Quote Call | HydroSense Texas",
  description:
    "Schedule a 15-minute phone assessment with HydroSense Texas. We review your home, plumbing layout, and carrier to confirm your insurance discount eligibility.",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <>
      <CriticalBar />
      <Header />
      <main className="py-16 lg:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl text-fog-50 mb-4">
              Book your 15-minute quote call
            </h1>
            <p className="text-fog-300 leading-relaxed">
              Pick a time that works. We will call you at that exact time to
              review your home, plumbing layout, and current carrier. By the
              end of the call you will know your exact discount tier and
              install pricing.
            </p>
          </div>

          <div className="bg-ink-800 border border-ink-700 rounded-xl p-4 lg:p-8 min-h-[500px]">
            <BookingEmbed />
          </div>

          <div className="mt-8 text-center">
            <p className="text-fog-400 text-sm">
              Prefer to call directly?{" "}
              <a
                href="tel:+12816945754"
                className="text-hydro-400 hover:text-hydro-300 transition-colors"
              >
                (281) 694-5754
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
