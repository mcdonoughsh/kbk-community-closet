import Image from "next/image";
import { EVENT_FLIERS } from "@/data/events";

export function EventFliersRow() {
  if (EVENT_FLIERS.length === 0) return null;

  return (
    <ul
      className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 sm:gap-8"
      aria-label="Event promotional fliers"
    >
      {EVENT_FLIERS.map(({ id, src, alt, width, height, label }) => (
        <li key={id} className="min-w-0">
          <figure className="overflow-hidden bg-white shadow-sm ring-1 ring-[var(--kbk-primary)]/10">
            <div className="relative aspect-[3/4] w-full bg-[var(--kbk-background)]">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="h-full w-full object-contain object-top"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <figcaption className="border-t border-[var(--kbk-primary)]/10 px-4 py-3 text-center text-sm font-semibold text-[var(--kbk-primary)]">
              {label}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
