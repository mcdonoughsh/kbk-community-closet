/**
 * Pickup expectations and map — uses <kbk-form-section> so the shell matches
 * Contact / Curated bags / Clothing / Gear sections.
 */
export function RequestPickupSection() {
  return (
    <kbk-form-section
      className="scroll-mt-20"
      heading="How Pickup Works"
      description="After you submit this form, a member of our team will reach out using the contact information you provide. When your order is ready, we place bagged items in an outdoor bin at Kennebunk Bible Church. Please pick up within 1 week of it being placed in the bin. If that timeline does not work for you, contact us before pickup so we can help arrange something that fits your situation."
    >
      <div className="rounded-xl overflow-hidden border border-[#025a9a]/10 bg-white">
        <div className="border-b border-[#025a9a]/10 p-5 sm:p-6">
          <p className="text-base font-medium text-[#171717] sm:text-lg">
            <span translate="no">Kennebunk Bible Church</span>
          </p>
          <p className="text-base font-medium text-[#171717] sm:text-lg">
            71 Portland Rd, Kennebunk, ME 04043
          </p>
          <a
            href="https://maps.app.goo.gl/j9puL9JLLX2Zf2js6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded font-semibold text-[#025a9a] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
          >
            Get directions
            <span aria-hidden>
              <ExternalLinkIcon />
            </span>
          </a>
        </div>
        <div className="relative aspect-[4/3] min-h-[240px] w-full bg-[#e6f4ff] sm:aspect-[16/9]">
          <iframe
            src="https://www.google.com/maps?q=71+Portland+Rd,+Kennebunk,+ME+04043&output=embed&z=15"
            title="Map: Kennebunk Bible Church pickup bin, 71 Portland Rd, Kennebunk, ME"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </kbk-form-section>
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
