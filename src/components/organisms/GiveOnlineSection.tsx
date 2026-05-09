/** Venmo profile for financial gifts (opens Venmo app or web). */
export const KBK_VENMO_URL = "https://venmo.com/sammy_mills";

export function GiveOnlineSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 bg-[#025a9a]"
      aria-labelledby="give-online-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="give-online-heading"
          className="text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance"
        >
          Give online
        </h2>
        <p className="mt-4 text-white/90 text-lg leading-relaxed text-pretty">
          Prefer to give financially? You can support KBK Community Closet with a
          gift through Venmo to co-founder Sammy Mills (
          <strong className="font-semibold text-white">@sammy_mills</strong>
          ). Thank you for helping neighbors with dignity.
        </p>
        <div className="mt-8">
          <a
            href={KBK_VENMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#025a9a] shadow-sm transition-colors hover:bg-white/90 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#025a9a]"
          >
            Give on Venmo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 01.75-.75h10.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V6.562l-8.72 8.72a.75.75 0 11-1.06-1.06l8.72-8.72H6.75a.75.75 0 010-1.5h4.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
