import type { Metadata } from "next";
import Image from "next/image";
import { EventGallery } from "./EventGallery";

const FACEBOOK_SPRING_EVENT_URL =
  "https://www.facebook.com/events/1473613661163090";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events and past events at KBK Community Closet. Drop-off windows, distribution days, and community gatherings.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      {/* Hero */}
      <section
        id="main-content"
        className="relative overflow-hidden px-10 py-10 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="events-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="events-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1] text-balance"
          >
            Events
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            Upcoming events and activities at KBK Community Closet. Check back
            for drop-off windows, distribution days, and community gatherings.
          </p>
        </div>
      </section>

      {/* Upcoming events — placeholder for Mothers Day */}
      <section
        className="px-4 pb-16 pt-0 sm:px-6 lg:px-8"
        aria-labelledby="upcoming-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="upcoming-heading"
            className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight text-balance"
          >
            Upcoming events
          </h2>
          <div className="mt-6 bg-white/95 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <div className="min-w-0 space-y-1.5 border-l-4 border-[var(--kbk-primary)] pl-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kbk-primary)]">
                  Mother&apos;s Day pop-up
                </p>
                <p className="text-base text-[var(--kbk-text-muted)] leading-relaxed text-pretty">
                  Let us know you&apos;re coming.
                </p>
              </div>
              <a
                href={FACEBOOK_SPRING_EVENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl bg-[var(--kbk-primary)] hover:bg-[var(--kbk-primary-hover)] touch-manipulation transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto sm:self-center sm:py-3"
              >
                RSVP on Facebook
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 01.75-.75h10.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V6.562l-8.72 8.72a.75.75 0 11-1.06-1.06l8.72-8.72H6.75a.75.75 0 010-1.5h4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
          <article
            className="mt-6 overflow-hidden bg-white sm:mt-8 lg:relative lg:-left-[80px] lg:right-[70px] lg:w-[116%]"
            aria-labelledby="swap-2025-heading"
          >
            <h3
              id="swap-2025-heading"
              className="sr-only"
            >
              Spring Pop-up 2026
            </h3>
            <div>
              <Image
                src="/images/popup-spring-2026/event-promo.png"
                alt="KBC Children's Community Closet promo: Needs your help! In one week we provided clothing for over 40 families. Your $25 donation helps buy bins to keep donated items organized and clean."
                width={612}
                height={816}
                className="w-full h-full"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </article>

        </div>
      </section>

      {/* Past events */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8 bg-white/50"
        aria-labelledby="past-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="past-heading"
            className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight text-balance"
          >
            Past events
          </h2>
          <p className="mt-2 text-[#171717]/80 text-lg">
            A look back at recent swaps and community closet events.
          </p>

          <article
            className="overflow-hidden bg-white"
            aria-labelledby="swap-2025-heading"
          >
            <h3
              id="swap-2025-heading"
              className="sr-only"
            >
              Swap 2025
            </h3>
            <div>
              <Image
                src="/images/swap-2025/swap-promo.png"
                alt="KBC Children's Community Closet promo: Needs your help! In one week we provided clothing for over 40 families. Your $25 donation helps buy bins to keep donated items organized and clean."
                width={612}
                height={816}
                className="w-full h-full"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
            <div className="p-5 sm:p-6 border-t border-[#025a9a]/10">
              <p className="text-[#171717]/80 text-base leading-relaxed">
                Our last swap event brought the community together to collect and
                distribute clothing and essentials. Over 40 families received
                clothing in one week. Thank you to everyone who donated and
                volunteered.
              </p>
            </div>
          </article>

          <h3
            id="swap-2025-gallery-heading"
            className="text-xl font-semibold text-[#025a9a] mt-10 mb-4 text-balance"
          >
            Gallery
          </h3>
          <EventGallery />

          <p className="mt-6 text-[#171717]/70 text-sm">
            Contact us if you’d like to share your event photos.
          </p>
        </div>
      </section>
    </div>
  );
}
