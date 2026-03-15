import type { Metadata } from "next";
import { faqPageIntro, faqItems } from "@/data/faqs";
import { FaqAccordion } from "@/components/organisms/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about KBK Community Closet.",
};

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      {/* Hero — same as donate */}
      <section
        className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
        aria-labelledby="faqs-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="faqs-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
          >
            {faqPageIntro.heading}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            {faqPageIntro.description}
          </p>
        </div>
      </section>

      <FaqAccordion items={faqItems} />
    </div>
  );
}
