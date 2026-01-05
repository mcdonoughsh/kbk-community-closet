import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/JsonLd";

const quicksand = Quicksand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KBK Community Closet - Supporting Our Community",
  description: "KBK Community Closet provides resources and support to our community. Request items, donate, and learn about upcoming events.",
  keywords: ["community closet", "donations", "charity", "community support"],
  openGraph: {
    title: "KBK Community Closet",
    description: "Supporting our community through donations and resources",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KBK Community Closet",
  description: "A community organization providing resources and support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} antialiased`}>
        <JsonLd data={jsonLd} />
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
