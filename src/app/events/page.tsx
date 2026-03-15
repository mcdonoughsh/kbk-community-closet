import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and activities at KBK Community Closet.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      {/* Hero — same as donate */}
      <section
        className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="events-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="events-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
          >
            Events
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            Upcoming events and activities at KBK Community Closet. Check back
            for drop-off windows, distribution days, and community gatherings.
          </p>
        </div>
      </section>
      {/* Events content will go here */}
    </div>
  );
}
