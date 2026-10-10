import Image from "next/image";
import { COSTUME_SWAP_2026 } from "@/data/events";
import { formatOrgShortDay } from "@/lib/eventSchedule";
import { PromoBannerLink } from "./HomePromoBanner";

const { title, venue, dateKey, dropOffDeadlineKey } = COSTUME_SWAP_2026;

export function CostumeSwapPromoBanner({ countdown }: { countdown: string }) {
  return (
    <aside
      id="costume-swap-promo-banner"
      aria-label={`${title} announcement`}
      className="flex flex-col items-center gap-2 bg-[#b35c00] px-4 py-3 text-white sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:px-6"
    >
      <div className="flex justify-center sm:justify-start">
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#025a9a]">
          {countdown}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <Image
          src="/images/costume-swap-2026/pumpkin.png"
          alt=""
          width={437}
          height={248}
          className="h-14 w-auto sm:h-[4.5rem]"
          sizes="(max-width: 640px) 100px, 130px"
          priority
        />
        {/* White is the only text color that clears 4.5:1 on #b35c00, so hierarchy comes from size and weight. */}
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-lg font-bold text-balance sm:text-xl">
            {title} at {venue}
          </p>
          <p className="text-base font-semibold text-balance">
            {formatOrgShortDay(dateKey)}
          </p>
          <p className="text-sm font-normal text-balance">
            Costume donations welcome through{" "}
            {formatOrgShortDay(dropOffDeadlineKey)}
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        <PromoBannerLink
          href="/events#costume-swap"
          className="text-white focus-visible:ring-white focus-visible:ring-offset-[#b35c00]"
        >
          Get the details
        </PromoBannerLink>
      </div>
    </aside>
  );
}
