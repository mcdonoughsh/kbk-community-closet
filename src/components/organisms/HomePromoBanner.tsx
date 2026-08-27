import Image from "next/image";
import Link from "next/link";

type PromoBannerConfig = {
  imageSrc: string;
  imageAlt: string;
  headline?: string;
};

const PROMO_CONFIG: Record<"spring" | "fall", PromoBannerConfig> = {
  spring: {
    imageSrc: "/images/homepage/promo/spring-event-text.png",
    imageAlt: "Spring Event",
    headline: "Mothers Day Pop-up",
  },
  fall: {
    imageSrc: "/images/homepage/promo/fall-event-text.png",
    imageAlt: "Fall Event",
  },
};

export type HomePromoBannerVariant = keyof typeof PROMO_CONFIG;

export function HomePromoBanner({ variant }: { variant: HomePromoBannerVariant }) {
  const { imageSrc, imageAlt, headline } = PROMO_CONFIG[variant];

  return (
    <div
      id={`${variant}-promo-banner`}
      className="flex flex-col items-center gap-1 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:px-6 bg-[#ffaa06]"
    >
      <div className="hidden sm:block" aria-hidden />
      <div
        id={`${variant}-promo-banner-text`}
        className="flex flex-col items-center justify-center gap-0"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={180}
          height={48}
          className="h-8 w-auto sm:h-10"
          sizes="(max-width: 640px) 140px, 180px"
        />
        {headline && (
          <h1 className="text-[#e45e5e] text-lg font-semibold">{headline}</h1>
        )}
      </div>
      <div className="flex justify-center sm:justify-end">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#025a9a] hover:text-[#025a9a]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ffaa06]"
        >
          See events
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
