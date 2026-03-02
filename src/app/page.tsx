import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import OnesieIcon from "@/components/OnesieIcon";

export const metadata: Metadata = {
  title: "Home",
  description:
    "KBK Community Closet provides curated bags of seasonal basics for families—by size. Request a bag or donate to support your community.",
};

const SIZES = [
  "Newborn",
  "0–3 months",
  "3–6 months",
  "6–9 months",
  "9–12 months",
  "12–18 months",
  "18–24 months",
  "2T",
  "3T",
  "4T and up",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--kbk-background)]">
      {/* Hero */}
      <PageHeader
        title="KBK Community Closet"
        subtitle="Curated bags of seasonal basics for families—by size."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center -mt-2 mb-4">
        <p className="text-[var(--kbk-text-muted)] text-base sm:text-lg">
          We put together bags so you get what you need. Request one, or help by
          donating.
        </p>
      </div>

      {/* Primary actions */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 mb-16 sm:mb-24">
        <Link
          href="/request"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-primary)] text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:ring-offset-2"
        >
          Request a bag
        </Link>
        <Link
          href="/donate"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[var(--kbk-primary)] rounded-xl text-base sm:text-lg font-semibold border-2 border-[var(--kbk-primary)] hover:bg-[var(--kbk-primary)]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:ring-offset-2"
        >
          Donate
        </Link>
      </div>

      {/* How we curate — main focus */}
      <section
        className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6"
        aria-labelledby="how-we-curate-heading"
      >
        <div className="absolute inset-0 bg-white rounded-t-[2rem] sm:rounded-t-[3rem]" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <h2
            id="how-we-curate-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--kbk-text)] text-center mb-4"
          >
            How we curate
          </h2>
          <p className="text-center text-[var(--kbk-text-muted)] text-lg sm:text-xl max-w-2xl mx-auto mb-12 sm:mb-16">
            We focus on seasonal basics—clothes and essentials that families use
            every day. You get a bag built for your child’s size.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            <div className="order-2 lg:order-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--kbk-text)] mb-2">
                  Bags by size
                </h3>
                <p className="text-[var(--kbk-text-muted)]">
                  We put together bags for newborn, 6–9 months, and up—as high as
                  we can go. Each bag is built around one size so you get a set
                  that fits.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--kbk-text)] mb-2">
                  Seasonal basics
                </h3>
                <p className="text-[var(--kbk-text-muted)]">
                  We aim to give families as much of the basics as we can,
                  season by season—so you’re covered when it matters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--kbk-text)] mb-2">
                  Optional specific requests
                </h3>
                <p className="text-[var(--kbk-text-muted)]">
                  Need something specific? You can tell us in our request form.
                  We’ll do our best when we have it.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--kbk-text)] mb-2">
                  Special items when we have them
                </h3>
                <p className="text-[var(--kbk-text-muted)]">
                  Sometimes we have bigger items—like a highchair or other
                  gear—donated by the community. When we do, we share them.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex items-center justify-center min-h-[240px] lg:min-h-0 h-full">
              <OnesieIcon className="h-full max-h-[320px] lg:max-h-none w-auto drop-shadow-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Size ladder */}
      <section
        className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--kbk-background)]"
        aria-labelledby="sizes-heading"
      >
        <div className="max-w-3xl mx-auto">
          <h2
            id="sizes-heading"
            className="text-xl sm:text-2xl font-semibold text-[var(--kbk-text)] text-center mb-3"
          >
            Sizes we cover
          </h2>
          <p className="text-center text-[var(--kbk-text-muted)] text-base sm:text-lg mb-10">
            From newborn through 4T and up—we go as high as we can.
          </p>
          <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {SIZES.map((size) => (
              <li
                key={size}
                className="px-4 py-2.5 bg-white rounded-xl text-[var(--kbk-text)] font-medium text-sm sm:text-base border border-[var(--kbk-border)] shadow-sm"
              >
                {size}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white rounded-t-[2rem] sm:rounded-t-[3rem]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--kbk-text)] mb-3">
            Ready to request or donate?
          </h2>
          <p className="text-[var(--kbk-text-muted)] text-base sm:text-lg mb-8">
            Request a curated bag for your child’s size, or donate items to help
            families in the community.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/request"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-primary)] text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:ring-offset-2"
            >
              Request a bag
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-secondary)] text-[var(--kbk-text)] rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-secondary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:ring-offset-2"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
