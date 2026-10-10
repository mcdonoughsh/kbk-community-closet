import Image from "next/image";
import Link from "next/link";
import { FALL_POPUP_2026 } from "@/data/events";
import { formatOrgDayLabel } from "@/lib/timezone";
import { formatOrgShortDay, orgDateKeyToDate } from "@/lib/eventSchedule";

const {
  title,
  eventDayKeys,
  venue,
  address,
  dropOffDayKeys,
  refreshmentsBy,
  flier,
} = FALL_POPUP_2026;

const eventDaysLabel = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
}).format(eventDayKeys.map((key) => formatOrgDayLabel(orgDateKeyToDate(key))));

export function FallPopupFeature({ countdown }: { countdown: string }) {
  return (
    <section
      id="fall-popup"
      className="scroll-mt-4 px-4 pb-12 sm:px-6 lg:px-8"
      aria-labelledby="fall-popup-heading"
    >
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 sm:gap-8">
        <a
          href={flier.src}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[791/1024] overflow-hidden bg-white ring-1 ring-[var(--kbk-primary)]/10 sm:aspect-auto hover:ring-4 hover:ring-[var(--kbk-primary)]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary-hover)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kbk-background)]"
        >
          <Image
            src={flier.src}
            alt={flier.alt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <span className="sr-only">(opens full-size flyer in a new tab)</span>
        </a>

        {/* The poster's aspect ratio acts as a minimum height here; the card still grows to fit its content. */}
        <div className="flex flex-col justify-center bg-white p-5 ring-1 ring-[var(--kbk-primary)]/10 sm:aspect-[791/1024] sm:p-7">
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#025a9a]">
            Upcoming event
            <span className="rounded-full bg-[#025a9a] px-2.5 py-0.5 text-sm normal-case tracking-normal text-white">
              {countdown}
            </span>
          </p>
          <h2
            id="fall-popup-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-balance text-[var(--kbk-primary-hover)] sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-[var(--kbk-text)]/80">
            Bring what’s extra, take what fits. Go home with kids’ clothes,
            shoes, toys, accessories, and gear you need for the upcoming
            season. Everyone is welcome.
          </p>

          <dl className="mt-5 space-y-3 text-base">
            <div>
              <dt className="font-semibold text-[var(--kbk-text)]">When</dt>
              <dd className="text-[var(--kbk-text)]/80">{eventDaysLabel}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--kbk-text)]">Where</dt>
              <dd className="text-[var(--kbk-text)]/80">
                {venue}, {address}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--kbk-text)]">
                Donate clothes
                <div className="font-normal text-[var(--kbk-text-muted)]">
                  Welcome, but not required
                </div>
              </dt>
              <dd className="text-[var(--kbk-text)]/80">
                Donate gently used clothes and get early access on Friday and
                Saturday. Drop-off days:
                <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                  {dropOffDayKeys.map((key) => (
                    <li
                      key={key}
                      className="rounded-full bg-[var(--kbk-background)] px-3 py-1 text-sm font-semibold text-[var(--kbk-primary-hover)]"
                    >
                      {formatOrgShortDay(key)}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/donate"
                  className="mt-3 inline-block text-sm font-semibold text-[var(--kbk-primary)] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
                >
                  What we accept
                </Link>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--kbk-text)]">
                Coffee &amp; treats
              </dt>
              <dd className="text-[var(--kbk-text)]/80">By {refreshmentsBy}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
