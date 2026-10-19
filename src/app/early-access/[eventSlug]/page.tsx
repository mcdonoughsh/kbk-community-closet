import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EARLY_ACCESS_EVENTS, getEarlyAccessEvent } from "@/data/earlyAccess";
import { isOrgDateUpcoming, orgDateKeyToDate } from "@/lib/eventSchedule";
import { formatOrgDayLabel } from "@/lib/timezone";
import { EarlyAccessSignupForm } from "./EarlyAccessSignupForm";

type Params = Promise<{ eventSlug: string }>;

export const dynamicParams = false;

/** Re-render hourly so the page closes itself once the event ends. */
export const revalidate = 3600;

export function generateStaticParams() {
  return EARLY_ACCESS_EVENTS.map((event) => ({ eventSlug: event.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getEarlyAccessEvent(eventSlug);
  return {
    title: event ? `${event.title} early access` : "Early access",
    robots: { index: false, follow: false },
  };
}

export default async function EarlyAccessPage({ params }: { params: Params }) {
  const { eventSlug } = await params;
  const event = getEarlyAccessEvent(eventSlug);
  if (!event) notFound();

  const isOpen = isOrgDateUpcoming(event.endDateKey);
  const days = event.hours.map((day) => ({
    dateKey: day.dateKey,
    label: formatOrgDayLabel(orgDateKeyToDate(day.dateKey)),
    earlyAccess: day.earlyAccess,
    openToAll: day.openToAll,
  }));

  return (
    <div className="min-h-screen bg-[var(--kbk-background)] font-sans">
      <section
        className="relative overflow-hidden px-6 py-10 sm:py-16 lg:px-8"
        aria-labelledby="early-access-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kbk-primary)]">
            Donor early access
          </p>
          <h1
            id="early-access-heading"
            className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-balance text-[var(--kbk-primary-hover)]"
          >
            {event.title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-[var(--kbk-text)]/80 sm:text-xl">
            {isOpen
              ? "Thanks for sharing your kids’ clothes! Add your name to the list and come shop before doors open to everyone."
              : `Early access for our ${event.title} has wrapped up. Thank you for being part of it!`}
          </p>
        </div>
      </section>

      {isOpen ? (
        <section className="px-4 pb-16 sm:px-6 lg:px-8" aria-label="Early access signup">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="rounded-xl bg-white/90 px-5 py-4 ring-1 ring-[var(--kbk-primary)]/10">
              <h2 className="text-base font-semibold text-[var(--kbk-text)]">
                {event.venue}, {event.address}
              </h2>
              <ul className="m-0 mt-3 list-none space-y-3 p-0">
                {days.map((day) => (
                  <li key={day.dateKey}>
                    <span className="font-medium text-[var(--kbk-text)]">{day.label}</span>
                    <span className="block text-sm tabular-nums text-[var(--kbk-text)]/80">
                      {day.earlyAccess} · Early access for those who donated
                    </span>
                    <span className="block text-sm tabular-nums text-[var(--kbk-text)]/80">
                      {day.openToAll} · Everyone welcome
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <EarlyAccessSignupForm eventSlug={event.slug} days={days} />
          </div>
        </section>
      ) : (
        <section className="px-4 pb-16 text-center sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--kbk-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--kbk-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          >
            See what’s coming up
          </Link>
        </section>
      )}
    </div>
  );
}
