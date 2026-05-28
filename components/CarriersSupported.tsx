const carriers = [
  "State Farm",
  "USAA",
  "Allstate",
  "Farmers",
  "Travelers",
  "Liberty Mutual",
  "Nationwide",
  "Progressive",
  "Texas Farm Bureau",
  "Chubb",
];

export default function CarriersSupported() {
  return (
    <section className="py-16 lg:py-24 bg-ink-950/50">
      <div className="section-container text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
          Carrier partners
        </p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-fog-50 mb-10">
          Recognized by every major Texas carrier
        </h2>
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {carriers.map((carrier) => (
            <span
              key={carrier}
              className="px-5 py-2.5 bg-ink-800/40 border border-ink-700/30 rounded-xl text-sm text-fog-200 backdrop-blur-sm"
            >
              {carrier}
            </span>
          ))}
        </div>
        <a
          href="#lead-form"
          className="inline-block mt-10 text-sm text-hydro-400 hover:text-hydro-300 transition-colors font-medium"
        >
          Not sure about your carrier? We will check for you.
        </a>
      </div>
    </section>
  );
}
