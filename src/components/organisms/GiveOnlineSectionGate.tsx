"use client";

import { usePathname } from "next/navigation";

/** Renders children on every route except the homepage (for the global Give online strip). */
export function GiveOnlineSectionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return <>{children}</>;
}
