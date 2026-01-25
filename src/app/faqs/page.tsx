import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about KBK Community Closet.",
};

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      <PageHeader title="FAQs" />
      {/* FAQs content will go here */}
    </div>
  );
}
