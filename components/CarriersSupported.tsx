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
    <section className="py-16 lg:py-20 bg-ink-950/50">
      <div className="section-container text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
          Recognized by every major Texas carrier
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {carriers.map((carrier) => (
            <span
              key={carrier}
              className="px-4 py-2 bg-ink-800 border border-ink-700 rounded-full text-sm text-fog-200"
            >
              {carrier}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
