"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/request", label: "Request" },
  { href: "/donate", label: "Donate" },
  { href: "/faqs", label: "FAQs" },
  { href: "/events", label: "Events" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav className="bg-[#e6f4ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex-shrink-0 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#025a9a] focus:ring-offset-2 rounded-lg"
              aria-label="KBK Community Closet – Home"
            >
              <img
                src="/images/nav-rack.svg"
                alt=""
                width={120}
                height={56}
                className="h-10 w-auto sm:h-12"
                fetchPriority="high"
              />
            </Link>
            <div className="flex justify-end">
              {/* Hamburger button */}
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#036bb6]"
                aria-expanded={isOpen}
                aria-label="Open menu"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-medium text-[#025a9a]">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#036bb6]"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer nav items */}
        <div className="py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-6 py-3 text-base sm:text-lg font-medium transition-colors ${
                  isActive
                    ? "bg-[#e6f4ff] text-[#036bb6] border-r-4 border-[#036bb6]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
