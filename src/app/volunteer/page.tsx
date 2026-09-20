import type { Metadata } from "next";
import { VolunteerSignupForm } from "./VolunteerSignupForm";

export const metadata: Metadata = {
  title: "Volunteers",
  description:
    "Sign up to volunteer with KBK Community Closet. Pick an open time and help get clothing to children and families.",
};

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff] font-sans">
      <section
        className="relative overflow-hidden px-6 py-10 sm:px-6 sm:py-16 lg:px-8"
        aria-labelledby="volunteer-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h1
            id="volunteer-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-[#025a9a] leading-[1.1]"
          >
            Volunteer with us
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-[#171717]/80 leading-relaxed">
            Pick an open time, share your contact info, and help us get clothing
            to kids and families in Kennebunk.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8" aria-label="Sign up form">
        <div className="mx-auto max-w-xl">
          <VolunteerSignupForm />
        </div>
      </section>
    </div>
  );
}
