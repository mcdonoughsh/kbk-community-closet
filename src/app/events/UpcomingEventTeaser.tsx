export function UpcomingEventTeaser() {
  return (
    <aside
      className="border-b border-[#e89a00]/40 bg-[#ffaa06] px-4 py-4 sm:px-6 sm:py-5"
      aria-labelledby="upcoming-teaser-heading"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#025a9a]">
            Upcoming Events
          </p>
          <h2
            id="upcoming-teaser-heading"
            className="mt-1 text-xl font-semibold text-balance text-[#e45e5e] sm:text-2xl"
          >
            Fall Pop-up
          </h2>
        </div>
        <p className="shrink-0 text-center text-base font-semibold tabular-nums text-[#025a9a] sm:text-right">
          November 13 & 14, 2026
        </p>
      </div>
    </aside>
  );
}
