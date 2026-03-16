"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const SWAP_2025_GALLERY_IMAGES = [
  "FullSizeRender (1).jpeg",
  "FullSizeRender (2).jpeg",
  "FullSizeRender (3).jpeg",
  "FullSizeRender (4).jpeg",
  "FullSizeRender.jpeg",
  "IMG_2040.JPG",
  "IMG_4283.jpeg",
  "IMG_4284.jpeg",
  "IMG_4285.jpeg",
  "IMG_4286.jpeg",
  "IMG_4292.jpeg",
  "IMG_4293.jpeg",
  "IMG_4295.jpeg",
  "IMG_4296.jpeg",
  "IMG_4297.jpeg",
  "IMG_4298.jpeg",
  "IMG_4299.jpeg",
] as const;

function getImageSrc(filename: string) {
  return `/images/swap-2025/${encodeURIComponent(filename)}`;
}

export function EventGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    previouslyFocusedRef.current =
      document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    };
  }, [openIndex, close]);

  const openImage = (index: number) => () => setOpenIndex(index);

  return (
    <>
      <ul
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 list-none p-0 m-0"
        role="list"
        aria-labelledby="swap-2025-gallery-heading"
      >
        {SWAP_2025_GALLERY_IMAGES.map((filename, index) => (
          <li key={filename} className="min-w-0">
            <button
              type="button"
              onClick={openImage(index)}
              className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#e6f4ff] ring-1 ring-[#025a9a]/10 block text-left touch-action-manipulation hover:ring-[#025a9a]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#036bb6] focus-visible:ring-offset-2 transition-[box-shadow]"
              aria-label={`View photo ${index + 1} from swap 2025 event full size`}
            >
              <Image
                src={getImageSrc(filename)}
                alt={`Photo ${index + 1} from swap 2025 event`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="View full size photo"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overscroll-contain"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <div
            className="relative flex items-center justify-center max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageSrc(SWAP_2025_GALLERY_IMAGES[openIndex])}
              alt={`Photo ${openIndex + 1} from swap 2025 event`}
              className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
              draggable={false}
              style={{ transformOrigin: "center" }}
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-800 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black touch-action-manipulation"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
