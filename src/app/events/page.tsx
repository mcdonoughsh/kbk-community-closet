import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Events - KBK Community Closet",
  description: "Upcoming events and activities at KBK Community Closet.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      <PageHeader title="Events" />
      {/* Events content will go here */}
    </div>
  );
}
