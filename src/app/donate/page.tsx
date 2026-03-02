import type { Metadata } from "next";
import Link from "next/link";

// When GivingFire is ready, set this URL and swap the button for a link.
const GIVING_FIRE_URL: string | null = null;

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Donate clean, gently used clothing to KBK Community Closet. Guidelines, drop-off locations, and how to give so your donations reach children and families quickly.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 lg:px-8"
        aria-labelledby="donate-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="donate-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
          >
            Donate with care
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            We&apos;re a volunteer-run closet getting clothing to children and
            families as quickly as possible. Following these guidelines helps
            your donation go straight to those who need it.
          </p>
        </div>
      </section>

      {/* What we need */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="guidelines-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="guidelines-heading"
            className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight"
          >
            What we need
          </h2>
          <p className="mt-2 text-[#171717]/80 text-lg">
            Quality donations we can distribute right away:
          </p>
          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2"
            role="list"
          >
            {[
              "Clean and washed",
              "Gently used, no tears or stains",
              "Clearly labeled (size, type) when possible",
              "Dropped off during our drop-off windows only",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white/90 px-5 py-4 shadow-sm ring-1 ring-[#025a9a]/10"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#025a9a]/15 text-[#025a9a]"
                  aria-hidden
                >
                  <CheckIcon />
                </span>
                <span className="text-[#171717] font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we can't accept */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8 bg-white/50"
        aria-labelledby="cannot-accept-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="cannot-accept-heading"
            className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight"
          >
            What we can&apos;t accept
          </h2>
          <p className="mt-2 text-[#171717]/80 text-lg">
            To move clothing quickly and with dignity, we can&apos;t distribute:
          </p>
          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2"
            role="list"
          >
            {[
              "Dirty or unwashed items",
              "Torn, stained, or damaged clothing",
              "Items with odors or mildew",
              "Donations left outside drop-off windows",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-[#171717]/10"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#171717]/10 text-[#171717]/70"
                  aria-hidden
                >
                  <XIcon />
                </span>
                <span className="text-[#171717]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Where & when to drop off */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="dropoff-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="dropoff-heading"
            className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight"
          >
            Where & when to drop off
          </h2>
          <p className="mt-2 text-[#171717]/80 text-lg">
            Donations are accepted only during scheduled drop-off windows so
            volunteers can process them safely.
          </p>
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-[#025a9a]/10">
              <div className="p-5 sm:p-6 border-b border-[#025a9a]/10">
                <p className="text-[#171717] font-medium">
                  71 Portland Rd, Kennebunk, ME 04043
                </p>
                <a
                  href="https://maps.app.goo.gl/gZHYBYV7KQHFGm2VA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[#025a9a] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#025a9a] focus:ring-offset-2 rounded"
                >
                  Get directions
                  <span aria-hidden>
                    <ExternalLinkIcon />
                  </span>
                </a>
              </div>
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[240px] bg-[#e6f4ff]">
                <iframe
                  src="https://www.google.com/maps?q=71+Portland+Rd,+Kennebunk,+ME+04043&output=embed&z=15"
                  title="Map: KBK Community Closet drop-off at 71 Portland Rd, Kennebunk, ME"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <p className="text-[#171717]/80 text-lg">
              Donations are accepted only during scheduled drop-off windows.
              Check back or contact us for the latest schedule.
            </p>
            <p className="text-[#025a9a] font-medium">
              Please do not leave donations outside or after hours.
            </p>
          </div>
        </div>
      </section>

      {/* Give online — GivingFire placeholder */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8 bg-[#025a9a]"
        aria-labelledby="give-online-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="give-online-heading"
            className="text-2xl sm:text-3xl font-semibold text-white tracking-tight"
          >
            Give online
          </h2>
          <p className="mt-4 text-white/90 text-lg leading-relaxed">
            Prefer to give financially? We&apos;re connecting with GivingFire so
            you can support the closet online. That option will be available
            here soon.
          </p>
          <div className="mt-8">
            {GIVING_FIRE_URL ? (
              <a
                href={GIVING_FIRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#025a9a] shadow-sm transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#025a9a]"
              >
                Donate via GivingFire
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center rounded-xl bg-white/90 px-6 py-3.5 text-base font-semibold text-[#025a9a] cursor-not-allowed opacity-90"
                aria-label="GivingFire donation link coming soon"
              >
                GivingFire — coming soon
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Back to home */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/"
            className="text-[#025a9a] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#025a9a] focus:ring-offset-2 focus:ring-offset-[#e6f4ff] rounded"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3L4.5 8.5L2 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 2l8 8M10 2L2 10" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
