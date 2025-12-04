"use client";

import { useState } from "react";
import { useGovernanceContract } from "@/hooks/contract";
import { MilestoneManager } from "@/components/milestones/MilestoneManager";
import { ProposalItem } from "@/components/proposals/ProposalItem";
import Link from "next/link";

export default function MilestonesPage() {
  const { proposalCount } = useGovernanceContract();
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);

  const proposalIds = Array.from({ length: Number(proposalCount) || 0 }, (_, i) => i + 1);

  if (!proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-[#F8F9FA] dark:from-black dark:via-black dark:to-[#0F0F0F]">
        <section className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
          <div className="relative w-full hero-section">
            <div className="w-full hero-content">
              <div className="text-center w-full">
                <div className="inline-flex items-center justify-center hero-icon animate-scale-in backdrop-blur-sm">
                  <span className="hero-icon-emoji">🎯</span>
                </div>
                <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                  No Proposals Available
                </h1>
                <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  There are no proposals in the system yet. Milestones can only be added to passed proposals.
                </p>
                <Link
                  href="/proposals"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] text-white font-bold py-3 sm:py-4 md:py-5 px-8 sm:px-10 md:px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base sm:text-lg md:text-xl animate-fade-in"
                  style={{ animationDelay: '300ms' }}
                >
                  View Proposals →
                </Link>
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
                <span className="hero-icon-emoji">🎯</span>
              </div>
              <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                Milestone Tracker
              </h1>
              <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                Manage and track project milestones for passed proposals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedProposalId ? (
        <section className="w-full section-container">
          <div className="w-full section-content">
            <div className="w-full space-y-6 sm:space-y-8 md:space-y-10" style={{ maxWidth: 'min(95%, 1200px)' }}>
              <div className="text-center">
                <button
                  onClick={() => setSelectedProposalId(null)}
                  className="text-[#2563EB] dark:text-[#3B82F6] hover:underline font-bold text-base sm:text-lg transition-colors"
                >
                  ← Back to proposal list
                </button>
              </div>
              
              <ProposalItem proposalId={selectedProposalId} showVoteButton={false} />
              
              <MilestoneManager 
                proposalId={selectedProposalId}
                onMilestoneAdded={() => {}}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full section-container">
          <div className="w-full section-content">
            <h2 className="feature-title text-black dark:text-white mb-8 sm:mb-10 md:mb-12 text-center animate-fade-in">
              Select a Proposal to Manage Milestones
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {proposalIds.map((id, index) => (
                <div 
                  key={id}
                  className="animate-fade-in cursor-pointer" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedProposalId(id)}
                >
                  <ProposalItem 
                    proposalId={id}
                    showVoteButton={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
