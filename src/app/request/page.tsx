import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { WebComponentsProvider } from "@/components/WebComponentsProvider";
import { RequestForm } from "@/components/organisms";

export const metadata: Metadata = {
  title: "Request",
  description: "Request items you need from the KBK Community Closet.",
};

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      <PageHeader title="Request" />

      {/* Hero — same rhythm as donate */}
      <section
        className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
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
            We&apos;ll collect four things: your contact info, curated bag requests,
            any specific clothing, and gear. You can add multiple bags (e.g. one 2T bag and two Newborn bags).
          </p>
        </div>
      </section>

      {/* Form: four distinct sections (contact, curated bags, clothing, gear) */}
      <section
        className="px-4 py-8 sm:px-6 lg:px-8 pb-16"
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
