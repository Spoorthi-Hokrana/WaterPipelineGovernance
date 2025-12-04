"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/proposals", label: "Proposals" },
  { href: "/voting", label: "Voting" },
  { href: "/milestones", label: "Milestones" },
  { href: "/governance", label: "Governance" },
];

export function MainNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 dark:from-[#3B82F6]/20 dark:to-[#2563EB]/20 group-hover:scale-110 transition-transform duration-200 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl">💧</span>
            </div>
            <span className="hidden sm:block text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">
              WATER PIPELINE
            </span>
            <span className="sm:hidden text-base sm:text-lg font-bold text-black dark:text-white">
              WPG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] rounded-xl shadow-lg -z-10 animate-scale-in"></span>
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:block">
              <ConnectWallet className="!h-10 sm:!h-11 !px-5 sm:!px-6 !text-xs sm:!text-sm font-semibold" />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 animate-slide-in">
            <div className="pt-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white shadow-lg"
                        : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5">
              <ConnectWallet className="w-full !h-11 sm:!h-12 !text-sm font-semibold" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
