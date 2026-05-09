import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supportSections, type SupportOrg } from "@/data/support";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Thank you to our partners, sponsors, and supporters who make KBK Community Closet possible.",
};

function SupportCard({ item }: { item: SupportOrg }) {
  const cardClass =
    "flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#025a9a]/10 transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-[#036bb6] min-h-[160px]";

  const body = (
    <>
      {item.logo ? (
        <div className="relative flex h-28 w-full items-center justify-center sm:h-32">
          <Image
            src={item.logo.src}
            alt={item.href ? "" : item.logoAlt}
            width={item.logo.width}
            height={item.logo.height}
            className="max-h-full w-auto max-w-full object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        </div>
      ) : (
        <p className="text-center text-lg font-semibold text-[#025a9a] text-pretty">
          {item.name}
        </p>
      )}
      {item.logo ? (
        <p className="mt-3 text-center text-sm font-medium text-[#171717]/75">
          {item.name}
        </p>
      ) : null}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClass} outline-none`}
      >
        {body}
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return <div className={cardClass}>{body}</div>;
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      <section
        className="relative overflow-hidden px-10 py-10 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="support-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="support-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1] text-balance"
          >
            Thank you for your support
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed text-pretty">
            KBK Community Closet is volunteer-run and community-powered. We are
            grateful to the partners, sponsors, and supporters who help us serve
            children and families with dignity and care.
          </p>
        </div>
      </section>

      <div className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-16">
          {supportSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2
                id={`${section.id}-heading`}
                className="text-2xl sm:text-3xl font-semibold text-[#025a9a] tracking-tight text-balance"
              >
                {section.title}
              </h2>
              <p className="mt-2 max-w-3xl text-[#171717]/80 text-lg">
                {section.description}
              </p>
              <ul
                className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                role="list"
              >
                {section.items.map((item) => (
                  <li key={item.name}>
                    <SupportCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white/40">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[#171717]/80">
            Interested in supporting the closet?{" "}
            <Link
              href="/donate"
              className="font-semibold text-[#025a9a] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[#025a9a] focus:ring-offset-2 rounded"
            >
              Learn how to donate
            </Link>{" "}
            or reach us at{" "}
            <a
              href="mailto:kbkcommunitycloset@gmail.com"
              className="font-semibold text-[#025a9a] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[#025a9a] focus:ring-offset-2 rounded"
            >
              kbkcommunitycloset@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
