import WaterFlowAnimation from "@/components/WaterFlowAnimation";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-ink-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-signal-400">
            How it works
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-fog-50">
            From normal flow to disaster averted in under nine seconds
          </h2>
          <p className="mt-6 text-lg text-fog-300">
            Watch what happens when a water heater fails in a home with a
            HydroSense smart shutoff installed.
          </p>
        </div>
        <div className="mx-auto max-w-6xl">
          <WaterFlowAnimation showTitle={false} showCaptions={true} />
        </div>
      </div>
    </section>
  );
}
