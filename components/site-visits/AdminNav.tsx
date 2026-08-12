import Link from "next/link";

export function AdminNav({ current }: { current: "leads" | "site-visits" | "quotes" }) {
  const links = [
    ["leads", "/admin/leads", "Leads"],
    ["site-visits", "/admin/site-visits", "Site visits"],
    ["quotes", "/admin/quotes", "Quotes"],
  ] as const;
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Admin navigation">
      {links.map(([key, href, label]) => (
        <Link
          key={key}
          href={href}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            current === key ? "bg-hydro-400 text-ink-950" : "bg-ink-800 text-fog-300 hover:text-fog-50"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
