import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { WebComponentsProvider } from "@/components/WebComponentsProvider";
import { RequestForm } from "@/components/organisms";

export const metadata: Metadata = {
  title: "Request",
  description: "Request items you need from the KBK Community Closet.",
};

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-[#e6f4ff]">
      <PageHeader title="Request" />
      
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <WebComponentsProvider>
          <RequestForm />
        </WebComponentsProvider>
      </div>
    </div>
  );
}
