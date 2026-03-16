import type { Metadata } from "next";
import Image from "next/image";
import { EventGallery } from "./EventGallery";

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
        className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
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
          <article
            className="mt-8 overflow-hidden bg-white"
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
