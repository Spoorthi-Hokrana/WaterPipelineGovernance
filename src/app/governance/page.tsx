"use client";

import { useActiveAccount } from "thirdweb/react";
import { VoterRegistration } from "@/components/governance/VoterRegistration";
import { ProposalCreation } from "@/components/governance/ProposalCreation";
import { ProposalFinalization } from "@/components/governance/ProposalFinalization";
import { MilestoneManagement } from "@/components/governance/MilestoneManagement";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";

export default function GovernancePage() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-[#F8F9FA] dark:from-black dark:via-black dark:to-[#0F0F0F]">
        <section className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
          <div className="relative w-full hero-section">
            <div className="w-full hero-content">
              <div className="text-center w-full">
                <div className="inline-flex items-center justify-center hero-icon animate-scale-in backdrop-blur-sm">
                  <span className="hero-icon-emoji">🔐</span>
                </div>
                <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                  Connect Your Wallet
                </h1>
                <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  Connect your wallet to access governance functions and manage the platform.
                </p>
                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <ConnectWallet className="!h-14 sm:!h-16 md:!h-18 !px-10 sm:!px-14 md:!px-18 !text-base sm:!text-lg md:!text-xl font-bold" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-[#F8F9FA] dark:from-black dark:via-black dark:to-[#0F0F0F]">
      {/* Hero Section - Fluid Width */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        
        <div className="relative w-full hero-section">
          <div className="w-full hero-content">
            <div className="text-center w-full">
              <div className="inline-flex items-center justify-center hero-icon animate-scale-in backdrop-blur-sm">
                <span className="hero-icon-emoji">⚙️</span>
              </div>
              <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                Governance Panel
              </h1>
              <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                Create proposals, register voters, and manage the decentralized governance system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Functions - Fluid Width Grid */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <VoterRegistration />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ProposalCreation />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <ProposalFinalization />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <MilestoneManagement />
            </div>
          </div>
        </div>
      </section>

      {/* Info Box - Fluid Width */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border-2 border-[#2563EB]/30 animate-fade-in" style={{ maxWidth: 'min(95%, 1200px)', margin: '0 auto' }}>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 text-center sm:text-left">
              <span className="text-3xl sm:text-4xl md:text-5xl mx-auto sm:mx-0">🏛️</span>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 sm:mb-4">
                  Decentralized Governance
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium leading-relaxed" style={{ lineHeight: '1.7' }}>
                  This is a fully decentralized governance system. Admin functions allow you to register voters, 
                  create proposals, finalize votes, and manage milestones. All actions are recorded on the blockchain 
                  for complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
