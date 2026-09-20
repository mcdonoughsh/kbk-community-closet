"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Site footer with Volunteers signup link. Hidden on admin routes. */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[#025a9a]/15 bg-[#e6f4ff]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--kbk-text-muted)]">
        <p>KBK Community Closet</p>
        <Link
          href="/volunteer"
          className="text-[var(--kbk-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kbk-primary)] focus-visible:ring-offset-2 rounded"
        >
          Volunteers
        </Link>
      </div>
    </footer>
  );
}
