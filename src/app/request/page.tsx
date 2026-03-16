import type { Metadata } from "next";
import { WebComponentsProvider } from "@/components/WebComponentsProvider";
import { RequestForm } from "@/components/organisms";

export const metadata: Metadata = {
  title: "Request",
  description: "Request items you need from the KBK Community Closet.",
};

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      {/* Hero — same rhythm as donate */}
      <section
        className="relative overflow-hidden px-10 py-10 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="request-heading"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1
            id="request-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
          >
            Request what you need
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            Help us understand what your family needs, and we will do our best to fulfill your request. Please provide a way for us to contact you, and we will work to get you what you need to the best of our ability.
          </p>
        </div>
      </section>

      {/* Form: four distinct sections (contact, curated bags, clothing, gear) */}
      <section
        className="px-4 sm:px-6 lg:px-8 pb-16"
        aria-label="Request form"
      >
        <div className="mx-auto max-w-4xl">
          <WebComponentsProvider>
            <RequestForm />
          </WebComponentsProvider>
        </div>
      </section>
    </div>
  );
}
