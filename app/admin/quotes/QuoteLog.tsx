import type { QuoteDeliveryEvent } from "@/lib/quote-delivery";
import type { Quote } from "./types";

const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
});

const deliveryTone: Record<QuoteDeliveryEvent["status"], string> = {
  pending: "bg-signal-400/15 text-signal-300",
  sent: "bg-green-500/15 text-green-300",
  failed: "bg-alert-500/15 text-red-300",
  skipped: "bg-fog-400/15 text-fog-300",
};

function formatTimestamp(value: string | null): string {
  return value ? dateTime.format(new Date(value)) : "Pending";
}

export default function QuoteLog({
  quote,
  deliveryEvents,
}: {
  quote: Quote;
  deliveryEvents: QuoteDeliveryEvent[];
}) {
  const lifecycle = [
    { label: "Quote created", at: quote.created_at },
    { label: "Most recently sent", at: quote.sent_at },
    { label: "Customer viewed quote", at: quote.viewed_at },
    { label: "Customer accepted quote", at: quote.accepted_at },
    { label: "Customer declined quote", at: quote.declined_at },
  ].filter((entry): entry is { label: string; at: string } => Boolean(entry.at));

  return (
    <section className="mx-auto max-w-4xl px-6 pb-12 text-fog-50">
      <div className="rounded-xl border border-white/10 bg-ink-900 p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fog-200">
            Quote log
          </h2>
          <p className="mt-1 text-xs text-fog-400">
            Provider acceptance records and customer lifecycle timestamps. Owner copies are sent by private BCC.
          </p>
        </div>

        <div className="space-y-3">
          {deliveryEvents.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-ink-950 p-4 text-sm text-fog-300">
              No detailed delivery attempts are recorded yet. Sends made before delivery logging was enabled are represented by the lifecycle timestamps below.
            </p>
          ) : (
            deliveryEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-white/10 bg-ink-950 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold capitalize text-fog-50">
                    {event.channel}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${deliveryTone[event.status]}`}>
                    {event.status === "sent" ? "provider accepted" : event.status}
                  </span>
                  <span className="ml-auto text-xs text-fog-400">
                    {formatTimestamp(event.completed_at || event.created_at)}
                  </span>
                </div>
                <dl className="mt-3 grid gap-2 text-xs text-fog-300 sm:grid-cols-2">
                  <div>
                    <dt className="text-fog-400">Customer recipient</dt>
                    <dd className="mt-0.5 break-all font-mono">{event.recipient || "Not provided"}</dd>
                  </div>
                  {event.copy_recipient && (
                    <div>
                      <dt className="text-fog-400">Private owner copy</dt>
                      <dd className="mt-0.5 break-all font-mono">{event.copy_recipient}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-fog-400">Provider</dt>
                    <dd className="mt-0.5">
                      {event.provider}
                      {event.provider_status ? ` · ${event.provider_status}` : ""}
                    </dd>
                  </div>
                  {event.provider_message_id && (
                    <div>
                      <dt className="text-fog-400">Provider message ID</dt>
                      <dd className="mt-0.5 break-all font-mono">{event.provider_message_id}</dd>
                    </div>
                  )}
                </dl>
                {event.error && (
                  <p className="mt-3 rounded bg-alert-500/10 px-3 py-2 text-xs text-red-300">
                    {event.error}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fog-400">
            Lifecycle
          </h3>
          <ol className="mt-3 space-y-2">
            {lifecycle.map((entry) => (
              <li key={entry.label} className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-fog-200">{entry.label}</span>
                <time className="text-xs text-fog-400" dateTime={entry.at}>
                  {formatTimestamp(entry.at)}
                </time>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
