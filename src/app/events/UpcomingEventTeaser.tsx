import { FALL_POPUP_2026 } from "@/data/events";

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
            {FALL_POPUP_2026.title}
          </h2>
        </div>
        <p className="shrink-0 text-center text-base font-semibold tabular-nums text-[#025a9a] sm:text-right">
          {FALL_POPUP_2026.dateLabel}
        </p>
      </div>
    </aside>
  );
}

export function FallPopupNextUp() {
  return (
    <p className="mt-6 text-center text-lg font-semibold text-balance text-white sm:mt-8">
      Coming up next:{" "}
      <a
        href="#fall-popup"
        className="underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kbk-primary-hover)]"
      >
        {FALL_POPUP_2026.title}, {FALL_POPUP_2026.dateLabel}
      </a>
    </p>
  );
}
