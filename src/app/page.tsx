"use client";

import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletStatus } from "@/components/wallet/WalletStatus";

export default function Home() {
  const account = useActiveAccount();
  const { proposalCount } = useGovernanceContract();

  const totalProposals = Number(proposalCount) || 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-[#F8F9FA] dark:from-black dark:via-black dark:to-[#0F0F0F]">
      {/* Hero Section - Fluid Width */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        
        <div className="relative w-full hero-section">
          <div className="w-full hero-content">
            <div className="text-center w-full">
              {/* Icon with Scale Animation */}
              <div className="inline-flex items-center justify-center hero-icon animate-scale-in backdrop-blur-sm">
                <span className="hero-icon-emoji">💧</span>
              </div>
              
              {/* Hero Title - Fluid Typography */}
              <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight leading-[0.9] animate-slide-up">
                WATER PIPELINE
                <br />
                <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#10B981] bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '100ms' }}>
                  GOVERNANCE
                </span>
              </h1>
              
              {/* Subtitle - Fluid Typography - Centered */}
              <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 mx-auto text-center font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
                Decentralized governance platform for transparent water pipeline management. 
                Vote on proposals, track milestones, ensure accountability.
              </p>
              
              {/* CTA */}
              {!account ? (
                <div className="flex flex-col items-center gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <ConnectWallet className="!h-14 sm:!h-16 md:!h-18 !px-10 sm:!px-14 md:!px-18 !text-base sm:!text-lg md:!text-xl font-bold" />
                  <p className="text-sm sm:text-base md:text-lg text-black/50 dark:text-white/50 font-medium text-center">
                    Connect your wallet to participate in governance
                  </p>
                </div>
              ) : (
                <div className="w-full flex justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <WalletStatus />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Fluid Width */}
      {account && totalProposals > 0 && (
        <section className="w-full section-container">
          <div className="w-full section-content">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
              <div className="group card-premium animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '100ms' }}>
                <div className="stats-icon mb-4 sm:mb-5 transition-transform duration-200 group-hover:scale-110">📊</div>
                <div className="stats-number text-black dark:text-white mb-2 sm:mb-3 tracking-tight">
                  {totalProposals}
                </div>
                <div className="stats-label text-black/60 dark:text-white/60 font-semibold">Total Proposals</div>
              </div>
              
              <div className="group card-premium bg-gradient-to-br from-[#2563EB] to-[#1E40AF] border-[#2563EB]/30 animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '200ms' }}>
                <div className="stats-icon mb-4 sm:mb-5 transition-transform duration-200 group-hover:scale-110">🗳️</div>
                <div className="stats-number text-white mb-2 sm:mb-3 tracking-tight">
                  Live
                </div>
                <div className="stats-label text-white/90 font-semibold">Voting Open</div>
              </div>
              
              <div className="group card-premium bg-gradient-to-br from-[#10B981] to-[#059669] border-[#10B981]/30 animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '300ms' }}>
                <div className="stats-icon mb-4 sm:mb-5 transition-transform duration-200 group-hover:scale-110">🏛️</div>
                <div className="stats-number text-white mb-2 sm:mb-3 tracking-tight">
                  Open
                </div>
                <div className="stats-label text-white/90 font-semibold">Governance</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Divider */}
      <div className="w-full section-divider-container">
        <div className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Feature Cards - Fluid Width Grid */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <Link
              href="/proposals"
              className="group card-premium hover:border-[#2563EB]/30 dark:hover:border-[#3B82F6]/30 animate-slide-up hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: '100ms' }}
            >
              <div className="inline-flex items-center justify-center feature-icon rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 dark:from-[#3B82F6]/20 dark:to-[#2563EB]/20 mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="feature-icon-emoji">📋</span>
              </div>
              <h3 className="feature-title text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                View Proposals
              </h3>
              <p className="feature-description text-black/60 dark:text-white/60 mb-5 sm:mb-6 font-medium leading-relaxed">
                Browse all governance proposals and track their current status
              </p>
              <div className="text-[#2563EB] dark:text-[#3B82F6] font-semibold feature-link group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center gap-2">
                Explore <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>

            <Link
              href="/voting"
              className="group card-premium bg-gradient-to-br from-[#2563EB] to-[#1E40AF] border-[#2563EB]/30 hover:shadow-2xl animate-slide-up hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: '200ms' }}
            >
              <div className="inline-flex items-center justify-center feature-icon rounded-2xl bg-white/20 backdrop-blur-sm mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="feature-icon-emoji">🗳️</span>
              </div>
              <h3 className="feature-title text-white mb-3 sm:mb-4 tracking-tight">
                Cast Votes
              </h3>
              <p className="feature-description text-white/90 mb-5 sm:mb-6 font-medium leading-relaxed">
                Participate in active voting with your weighted voting power
              </p>
              <div className="text-white font-semibold feature-link group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center gap-2">
                Vote Now <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>

            <Link
              href="/milestones"
              className="group card-premium hover:border-[#10B981]/30 dark:hover:border-[#22C55E]/30 animate-slide-up hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: '300ms' }}
            >
              <div className="inline-flex items-center justify-center feature-icon rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 dark:from-[#22C55E]/20 dark:to-[#10B981]/20 mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="feature-icon-emoji">🎯</span>
              </div>
              <h3 className="feature-title text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                Track Milestones
              </h3>
              <p className="feature-description text-black/60 dark:text-white/60 mb-5 sm:mb-6 font-medium leading-relaxed">
                Monitor project progress and milestone completion in real-time
              </p>
              <div className="text-[#10B981] dark:text-[#22C55E] font-semibold feature-link group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center gap-2">
                Track <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>

            <Link
              href="/governance"
              className="group card-premium bg-gradient-to-br from-[#D946A6] to-[#C026A3] border-[#D946A6]/30 hover:shadow-2xl animate-slide-up hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: '400ms' }}
            >
              <div className="inline-flex items-center justify-center feature-icon rounded-2xl bg-white/20 backdrop-blur-sm mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="feature-icon-emoji">⚙️</span>
              </div>
              <h3 className="feature-title text-white mb-3 sm:mb-4 tracking-tight">
                Governance
              </h3>
              <p className="feature-description text-white/90 mb-5 sm:mb-6 font-medium leading-relaxed">
                Create proposals, register voters, and manage the system
              </p>
              <div className="text-white font-semibold feature-link group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center gap-2">
                Participate <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="w-full section-divider-container">
        <div className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Platform Features Section - Fluid Width */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          <div className="card-premium features-card bg-gradient-to-br from-white/50 to-[#F8F9FA]/50 dark:from-[#1A1A1A]/50 dark:to-[#0F0F0F]/50 backdrop-blur-xl">
            <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
              <h2 className="features-title text-black dark:text-white mb-4 sm:mb-5 md:mb-6 tracking-tight">
                Platform Features
              </h2>
              <p className="features-subtitle text-black/60 dark:text-white/60 mx-auto font-medium leading-relaxed">
                Everything you need for transparent, decentralized governance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
              <div className="text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="inline-flex items-center justify-center feature-icon-lg rounded-3xl bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 dark:from-[#3B82F6]/20 dark:to-[#2563EB]/20 mb-5 sm:mb-6 backdrop-blur-sm">
                  <span className="feature-icon-lg-emoji">🏛️</span>
                </div>
                <h3 className="feature-item-title text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Decentralized
                </h3>
                <p className="feature-item-description text-black/60 dark:text-white/60 font-medium leading-relaxed mx-auto">
                  Democratic decision-making with weighted voting based on stakeholder roles and responsibilities
                </p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="inline-flex items-center justify-center feature-icon-lg rounded-3xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 dark:from-[#22C55E]/20 dark:to-[#10B981]/20 mb-5 sm:mb-6 backdrop-blur-sm">
                  <span className="feature-icon-lg-emoji">🔗</span>
                </div>
                <h3 className="feature-item-title text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Transparent
                </h3>
                <p className="feature-item-description text-black/60 dark:text-white/60 font-medium leading-relaxed mx-auto">
                  All votes and decisions recorded immutably on blockchain for complete transparency and auditability
                </p>
              </div>
              
              <div className="text-center animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '300ms' }}>
                <div className="inline-flex items-center justify-center feature-icon-lg rounded-3xl bg-gradient-to-br from-[#D946A6]/10 to-[#C026A3]/10 dark:from-[#EC4899]/20 dark:to-[#D946A6]/20 mb-5 sm:mb-6 backdrop-blur-sm">
                  <span className="feature-icon-lg-emoji">💰</span>
                </div>
                <h3 className="feature-item-title text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                  Accountable
                </h3>
                <p className="feature-item-description text-black/60 dark:text-white/60 font-medium leading-relaxed mx-auto">
                  Milestone-based funding with verified completion tracking and automatic fund release
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
