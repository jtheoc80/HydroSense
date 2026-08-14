import Link from "next/link";
import { absoluteSearchUrl } from "@/lib/seo/indexable-pages";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
  trailId: string;
  tone?: "dark" | "light";
  className?: string;
}

export default function Breadcrumbs({
  items,
  trailId,
  tone = "dark",
  className = "",
}: BreadcrumbsProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSearchUrl(item.href),
    })),
  };

  const linkClass =
    tone === "light"
      ? "text-slate-500 transition-colors hover:text-sky-700"
      : "text-fog-400 transition-colors hover:text-fog-200";
  const currentClass = tone === "light" ? "text-slate-700" : "text-fog-200";

  return (
    <>
      <script
        id={`breadcrumb-${trailId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`.trim()}>
        <ol className="flex flex-wrap items-center gap-y-1">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden="true" className={`mx-2 ${linkClass}`}>
                    /
                  </span>
                ) : null}
                {isCurrent ? (
                  <span aria-current="page" className={currentClass}>
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
