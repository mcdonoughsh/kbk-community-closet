"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import type { FaqItem } from "@/data/faqs";

interface FaqAccordionProps {
  items: FaqItem[];
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function matches(item: FaqItem, query: string): boolean {
  if (!query) return true;
  const nq = normalizeQuery(query);
  return (
    item.question.toLowerCase().includes(nq) ||
    item.answer.toLowerCase().includes(nq)
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => (query ? items.filter((item) => matches(item, query)) : items),
    [items, query]
  );

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(id);
      }
    },
    [toggle]
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      className="px-4 sm:px-6 lg:px-8"
      aria-labelledby="faq-search-label"
    >
      <div className="mx-auto max-w-3xl">
        <label id="faq-search-label" htmlFor="faq-search" className="sr-only">
          Search FAQs
        </label>
        <input
          id="faq-search"
          name="faq-search"
          type="search"
          role="searchbox"
          autoComplete="off"
          aria-label="Search FAQs by question or answer"
          placeholder="Search FAQs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-10 w-full rounded-xl border border-[#025a9a]/20 bg-white px-4 py-3 text-[#171717] placeholder:text-[#171717]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-offset-2"
        />

        {filtered.length === 0 ? (
          <p
            className="text-center text-[#171717]/70"
            aria-live="polite"
          >
            No FAQs match your search. Try different words or clear the search.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const isOpen = openIds.has(item.id);
              const contentId = `faq-answer-${item.id}`;
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#025a9a]/10"
                >
                  <h2 className="border-b border-[#025a9a]/10">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      id={`faq-question-${item.id}`}
                      onClick={() => toggle(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[#025a9a] transition-colors hover:bg-[#025a9a]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#025a9a] focus-visible:ring-inset"
                    >
                      <span className="min-w-0 flex-1">{item.question}</span>
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#025a9a]/10 text-[#025a9a]"
                        aria-hidden
                      >
                        <ChevronIcon open={isOpen} reducedMotion={prefersReducedMotion} />
                      </span>
                    </button>
                  </h2>
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    hidden={!isOpen}
                    className="px-5 py-4 text-[#171717]/90"
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ChevronIcon({
  open,
  reducedMotion,
}: {
  open: boolean;
  reducedMotion: boolean;
}) {
  const duration = reducedMotion ? "0ms" : "200ms";
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: `transform ${duration} ease`,
      }}
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}
