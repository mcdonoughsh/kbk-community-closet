import Image from "next/image";
import type { ReactNode } from "react";
import { COSTUME_SWAP_2026 } from "@/data/events";
import { formatOrgDayLabel } from "@/lib/timezone";
import { orgDateKeyToDate } from "@/lib/eventSchedule";

const { title, venue, dateKey, dropOffAddress, dropOffDeadlineKey, flier } =
  COSTUME_SWAP_2026;

const eventDayLabel = formatOrgDayLabel(orgDateKeyToDate(dateKey));
const dropOffDeadlineLabel = formatOrgDayLabel(
  orgDateKeyToDate(dropOffDeadlineKey)
);

export function CostumeSwapFeature({
  countdown,
  children,
}: {
  countdown: string;
  children?: ReactNode;
}) {
  return (
    <section
      id="costume-swap"
      className="scroll-mt-4 bg-[var(--kbk-primary-hover)] px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      aria-labelledby="costume-swap-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          <a
            href={flier.src}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-square overflow-hidden bg-[#fdf8ee] sm:aspect-auto hover:ring-4 hover:ring-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kbk-primary-hover)]"
          >
            <Image
              src={flier.src}
              alt={flier.alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 100vw, 512px"
            />
            <span className="sr-only">(opens full-size flyer in a new tab)</span>
          </a>

          {/* aspect-square acts as a minimum height here; the card still grows to fit its content. */}
          <div className="flex flex-col justify-center bg-white p-5 sm:aspect-square sm:p-7">
            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#025a9a]">
              Upcoming event
              <span className="rounded-full bg-[#025a9a] px-2.5 py-0.5 text-white normal-case tracking-normal text-sm">
                {countdown}
              </span>
            </p>
            <h2
              id="costume-swap-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-balance text-[var(--kbk-primary-hover)] sm:text-3xl"
            >
              {title} at {venue}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-pretty text-[var(--kbk-text)]/80">
              Give costumes a second life, reduce waste, and help make Halloween
              fun and accessible for local families. Free event, and everyone
              is welcome. You don’t need to bring a costume to take one.
            </p>

            <dl className="mt-5 space-y-3 text-base">
              <div>
                <dt className="font-semibold text-[var(--kbk-text)]">Swap</dt>
                <dd className="text-[var(--kbk-text)]/80">
                  {eventDayLabel} at {venue}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--kbk-text)]">
                  Donate costumes{" "}
                  <div className="font-normal text-[var(--kbk-text-muted)]">
                    Welcome, but not required
                  </div>
                </dt>
                <dd className="text-[var(--kbk-text)]/80">
                  Clean, gently used kids’ costumes. Drop off at{" "}
                  {dropOffAddress} now through {dropOffDeadlineLabel}, or bring
                  them the day of.
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
