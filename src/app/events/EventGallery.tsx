"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EventGalleryImage } from "@/data/events";

type EventGalleryProps = {
  images: readonly EventGalleryImage[];
  basePath: string;
  headingId: string;
  eventLabel: string;
};

function getImageSrc(basePath: string, filename: string) {
  return `${basePath}/${encodeURIComponent(filename)}`;
}

export function EventGallery({
  images,
  basePath,
  headingId,
  eventLabel,
}: EventGalleryProps) {
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

  if (images.length === 0) return null;

  const openImageData = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <ul
        className="grid grid-cols-2 gap-3 list-none p-0 m-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        role="list"
        aria-labelledby={headingId}
      >
        {images.map(({ filename, alt }, index) => (
          <li key={filename} className="min-w-0">
            <button
              type="button"
              onClick={openImage(index)}
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--kbk-background)] text-left ring-1 ring-[var(--kbk-primary)]/10 touch-manipulation transition-[box-shadow] motion-reduce:transition-none hover:ring-[var(--kbk-primary)]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-border-focus)] focus-visible:ring-offset-2"
              aria-label={`View photo ${index + 1} from ${eventLabel} full size`}
            >
              <Image
                src={getImageSrc(basePath, filename)}
                alt={alt}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </button>
          </li>
        ))}
      </ul>

      {openImageData !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="View full size photo"
          className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-black/80 p-4"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <div
            className="relative flex h-full max-h-[90vh] w-full max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageSrc(basePath, openImageData.filename)}
              alt={openImageData.alt}
              width={1024}
              height={768}
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto object-contain"
              draggable={false}
              style={{ transformOrigin: "center" }}
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="absolute top-4 right-4 touch-manipulation rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
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
