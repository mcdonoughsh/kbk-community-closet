import Image from "next/image";
import type { FeaturedGearItem } from "@/types";

interface FeaturedGearCardProps {
  item: FeaturedGearItem;
}

export function FeaturedGearCard({ item }: FeaturedGearCardProps) {
  return (
    <li className="flex min-w-0 flex-col rounded-xl bg-white shadow-sm ring-1 ring-[#025a9a]/10 overflow-hidden">
      {item.image ? (
        <div className="relative aspect-[4/3] w-full bg-[#e6f4ff]">
          <Image
            src={item.image.url}
            alt={item.image.alt ?? item.title}
            width={item.image.width}
            height={item.image.height}
            loading="lazy"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-[#e6f4ff]" aria-hidden />
      )}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="font-semibold text-[#025a9a] text-wrap-balance">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--kbk-text-muted)] line-clamp-3 break-words">
          {item.description}
        </p>
        <span
          className={`mt-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === "available"
              ? "bg-[#025a9a]/15 text-[#025a9a]"
              : "bg-[#171717]/10 text-[#171717]/70"
          }`}
        >
          {item.status === "available" ? "Available" : "Claimed"}
        </span>
      </div>
    </li>
  );
}
