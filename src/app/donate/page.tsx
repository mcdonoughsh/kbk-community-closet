import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Donate - KBK Community Closet",
  description: "Donate items to support the KBK Community Closet.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      <PageHeader title="Donate" />
      {/* Donate form will go here */}
    </div>
  );
}
