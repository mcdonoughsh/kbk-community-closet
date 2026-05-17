import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomePromoBanner } from "@/components/organisms/HomePromoBanner";
import { FeaturedGearCard } from "@/components/organisms/FeaturedGearCard";
import {
  isFallPromoBannerEnabled,
  isSpringPromoBannerEnabled,
} from "@/lib/featureFlags";
import { getFeaturedGear } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Home",
  description:
    "At the Kennebunk Community Closet, we believe every child deserves clothing that fits, feels good, and supports their growth—without financial stress on their family. We value dignity, generosity, sustainability, and community care. Our work is grounded in the belief that neighbors helping neighbors strengthens everyone, and that sharing resources thoughtfully helps families thrive while reducing waste.",
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

export default async function Home() {
  const featuredGear = await getFeaturedGear();

  const showSpringPromoBanner = isSpringPromoBannerEnabled();
  const showFallPromoBanner = isFallPromoBannerEnabled();

  return (
    <>
      {showSpringPromoBanner && <HomePromoBanner variant="spring" />}
      {showFallPromoBanner && <HomePromoBanner variant="fall" />}
      <div className="min-h-screen bg-[#e6f4ff] font-sans">
        {/* Hero — same rhythm as donate / request */}
        <section
          className="relative overflow-hidden px-10 py-10 sm:px-6 sm:py-16 lg:px-8"
          aria-labelledby="home-heading"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h1
              id="home-heading"
              className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
            >
              KBK Community Closet
            </h1>
            <p className="mt-6 mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
              At the Kennebunk Community Closet, we believe every child deserves clothing that fits, feels good, and supports their growth without financial stress on their family. We value dignity, generosity, sustainability, and community care. Our work is grounded in the belief that neighbors helping neighbors strengthens everyone, and that sharing resources thoughtfully helps families thrive while reducing waste.
            </p>
          </div>
        </section>

        {/* Primary actions */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 mb-16 sm:mb-24">
          <Link
            href="/request"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-primary)] text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          >
            Request
          </Link>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[var(--kbk-primary)] rounded-xl text-base sm:text-lg font-semibold border-1 border-[var(--kbk-primary)] hover:bg-[var(--kbk-primary)]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
          >
            Donate
          </Link>
        </div>

        {/* Featured Gear — only when we have items */}
        {featuredGear.length > 0 && (
          <section
            className="px-4 py-16 sm:px-6 lg:px-8"
            aria-labelledby="featured-gear-heading"
          >
            <div className="mx-auto max-w-5xl">
              <h2
                id="featured-gear-heading"
                className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight text-center mb-4"
              >
                Featured Gear
              </h2>
              <p className="text-center text-[var(--kbk-text-muted)] text-lg max-w-2xl mx-auto mb-10">
                Donated items from the community that you can request when
                available.
              </p>
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                role="list"
              >
                {featuredGear.map((item) => (
                  <FeaturedGearCard key={item.id} item={item} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* How we curate — main focus */}
        <section
          className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6"
          aria-labelledby="how-we-curate-heading"
        >
          <div className="absolute inset-0 bg-white rounded-t-[2rem] sm:rounded-t-[3rem]" />
          <div className="relative z-10 max-w-5xl mx-auto">
            <h2
              id="how-we-curate-heading"
              className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight text-center mb-4"
            >
              How we curate
            </h2>
            <p className="text-center text-[var(--kbk-text-muted)] text-lg sm:text-xl max-w-2xl mx-auto mb-12 sm:mb-16">
              We focus on seasonal basics clothes and essentials that families use
              every day. You get a bag built for your child’s size.
            </p>

            <div className="flex flex-col gap-12 sm:gap-16">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--kbk-text)] mb-2">
                    Bags by size
                  </h3>
                  <p className="text-[var(--kbk-text-muted)]">
                    We put together bags for newborn, 3-6 months, 6-9 months, and up as high as
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
                    season by season so you’re covered when it matters.
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
                    Sometimes we have bigger items like a highchair or other
                    gear donated by the community. When we do, we share them.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-6 max-w-2xl mx-auto">
                <Image
                  src="/images/homepage/boy-bag.jpg"
                  alt="Curated bag of children’s clothes by size from the community closet"
                  width={560}
                  height={420}
                  className="w-full h-auto rounded-xl shadow-md object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                />
                <Image
                  src="/images/homepage/table-pjs.jpeg"
                  alt="Seasonal children’s clothes and pajamas laid out on a table"
                  width={560}
                  height={420}
                  className="w-full h-auto rounded-xl shadow-md object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading="lazy"
                />
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
              className="text-xl sm:text-2xl font-semibold text-[#025a9a] text-center mb-3"
            >
              Sizes we cover
            </h2>
            <p className="text-center text-[var(--kbk-text-muted)] text-base sm:text-lg mb-10">
              From newborn through 4T and up. We try to supply based on need and inventory.
            </p>
            <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {SIZES.map((size) => (
                <li
                  key={size}
                  className="px-4 py-2.5 bg-white rounded-xl text-[var(--kbk-text)] font-medium text-sm sm:text-base border border-[var(--kbk-border)]"
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
            <h2 className="text-xl sm:text-2xl font-semibold text-[#025a9a] mb-3">
              Ready to request or donate?
            </h2>
            <p className="text-[var(--kbk-text-muted)] text-base sm:text-lg mb-10">
              Request a curated bag for your child’s size, or donate items to help
              families in the community.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/request"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-primary)] text-white rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-primary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
              >
                Request
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--kbk-secondary)] text-[var(--kbk-text)] rounded-xl text-base sm:text-lg font-semibold hover:bg-[var(--kbk-secondary-hover)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2"
              >
                Donate
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
