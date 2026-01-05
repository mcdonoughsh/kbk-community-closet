import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Home - KBK Community Closet",
  description: "KBK Community Closet provides resources and support to our community.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      {/* Hero Section */}
      <PageHeader
        title="KBK Community Closet"
        subtitle="Members of the community supporting each other"
      />
      
      {/* Action buttons */}
      <div className="flex justify-center gap-4 sm:gap-6 px-4 -mt-4 sm:-mt-6">
        <Link
          href="/donate"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-800 rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Donate
        </Link>
        <Link
          href="/request"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-sm sm:text-base lg:text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Request
        </Link>
      </div>
      
      {/* Current Highly Requested Item Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 text-center mb-8 sm:mb-12">
          Current Highly Requested Item
        </h2>
        {/* Content will go here */}
      </div>
    </div>
  );
}
