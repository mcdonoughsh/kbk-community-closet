import type { Metadata } from "next";
import Image from "next/image";
import { EventGallery } from "./EventGallery";
import { EventFliersRow } from "./EventFliersRow";
import { UpcomingEventTeaser } from "./UpcomingEventTeaser";
import { SpringEventRecap } from "./SpringEventRecap";
import {
  SPRING_2026_GALLERY,
  SWAP_2025_GALLERY,
  SPRING_2026_EVENT_DATE,
  SPRING_2026_EVENT_TITLE,
  formatEventMonthYear,
  getSpring2026GallerySrc,
  SPRING_2026_GALLERY_BASE,
  SWAP_2025_GALLERY_BASE,
} from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "KBK Community Closet pop-up events—sustainability, neighbors helping neighbors, and community care. Fall pop-up coming soon.",
};

const springEventLabel = formatEventMonthYear(SPRING_2026_EVENT_DATE);

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[var(--kbk-background)] font-sans">
      <UpcomingEventTeaser />
      <section
        id="main-content"
        className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="events-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="events-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-balance text-[var(--kbk-primary-hover)]"
          >
            Events
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-[var(--kbk-text)]/80 sm:text-xl">
            Our pop-ups are where sustainability and community care go hand in
            hand neighbors donating, volunteering, and supporting one another
            so kids’ clothing, shoes, toys, books, and baby essentials find new
            homes instead of landfills.
          </p>
        </div>
      </section>

      <section
        className="px-4 pb-12 sm:px-6 lg:px-8"
        aria-labelledby="recent-event-heading"
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--kbk-primary)]">
            Most recent
          </p>
          <h2
            id="recent-event-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-balance text-[var(--kbk-primary-hover)] sm:text-3xl"
          >
            {SPRING_2026_EVENT_TITLE}
          </h2>
          <p className="mt-1 text-base text-[var(--kbk-text-muted)]">
            {springEventLabel}
          </p>

          <article className="mt-8 overflow-hidden bg-white shadow-sm ring-1 ring-[var(--kbk-primary)]/10">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
              <Image
                src={getSpring2026GallerySrc("hero-room-wide.jpeg")}
                alt="Families browsing tables of children's clothing at the KBK Kids Community Closet spring event"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <div className="p-5 sm:p-8">
              <SpringEventRecap />
            </div>
          </article>

          <h3
            id="spring-2026-gallery-heading"
            className="mt-10 mb-4 text-xl font-semibold text-balance text-[var(--kbk-primary-hover)]"
          >
            Event photos
          </h3>
          <EventGallery
            images={SPRING_2026_GALLERY}
            basePath={SPRING_2026_GALLERY_BASE}
            headingId="spring-2026-gallery-heading"
            eventLabel="Spring Pop-up 2026"
          />
        </div>
      </section>

      <section
        className="border-y border-[var(--kbk-primary)]/10 bg-white/60 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="fliers-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="fliers-heading"
            className="text-2xl font-semibold tracking-tight text-balance text-[var(--kbk-primary-hover)] sm:text-3xl"
          >
            Event fliers
          </h2>
          <div className="mt-8">
            <EventFliersRow />
          </div>
        </div>
      </section>

      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="past-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="past-heading"
            className="text-2xl font-semibold tracking-tight text-balance text-[var(--kbk-primary-hover)] sm:text-3xl"
          >
            Past events
          </h2>
          <p className="mt-2 text-lg text-pretty text-[var(--kbk-text)]/80">
            Earlier gatherings where neighbors shared resources and kept quality items in circulation.
          </p>

          <article
            className="mt-8 bg-white p-5 shadow-sm ring-1 ring-[var(--kbk-primary)]/10 sm:p-8"
            aria-labelledby="swap-2025-heading"
          >
            <h3
              id="swap-2025-heading"
              className="text-xl font-semibold text-[var(--kbk-primary-hover)]"
            >
              Community Swap 2025
            </h3>
            <p className="mt-3 text-base leading-relaxed text-pretty text-[var(--kbk-text)]/80">
              Our swap brought neighbors together to collect and distribute
              clothing and essentials keeping items in use and supporting local
              families. Thank you to everyone who donated and volunteered.
            </p>
          </article>

          <h3
            id="swap-2025-gallery-heading"
            className="mt-10 mb-4 text-xl font-semibold text-balance text-[var(--kbk-primary-hover)]"
          >
            Swap 2025 photos
          </h3>
          <EventGallery
            images={SWAP_2025_GALLERY}
            basePath={SWAP_2025_GALLERY_BASE}
            headingId="swap-2025-gallery-heading"
            eventLabel="Community Swap 2025"
          />

          <p className="mt-8 text-sm text-[var(--kbk-text-muted)]">
            Contact us if you&apos;d like to share your event photos.
          </p>
        </div>
      </section>

      <section
        className="px-4 pb-16 sm:px-6 lg:px-8"
        aria-labelledby="stay-updated-heading"
      >
        <div className="mx-auto max-w-3xl rounded-xl bg-white/95 p-6 text-center shadow-sm ring-1 ring-[var(--kbk-primary)]/10 sm:p-8">
          <h2
            id="stay-updated-heading"
            className="text-xl font-semibold text-balance text-[var(--kbk-primary-hover)]"
          >
            Stay updated
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-[var(--kbk-text)]/80">
            We are working on the fall pop up, and will post dates as soon as they are confirmed! Another chance to share, swap, and support one
            another while keeping great items out of landfills.
          </p>
        </div>
      </section>
    </div>
  );
}
