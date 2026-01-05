import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Request Items - KBK Community Closet",
  description: "Request items you need from the KBK Community Closet.",
};

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      <PageHeader title="Request" />
      {/* Request form will go here */}
    </div>
  );
}
