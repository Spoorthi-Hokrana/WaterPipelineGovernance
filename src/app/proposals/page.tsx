"use client";

import { useState, useMemo } from "react";
import { useGovernanceContract, ProposalStatus } from "@/hooks/contract";
import { ProposalItem } from "@/components/proposals/ProposalItem";
import { ProposalFilters } from "@/components/proposals/ProposalFilters";
import Link from "next/link";

export default function ProposalsPage() {
  const { proposalCount } = useGovernanceContract();
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">("newest");

  const proposalIds = useMemo(() => {
    const count = Number(proposalCount) || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [proposalCount]);

  if (!proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white via-white to-[#F8F9FA] dark:from-black dark:via-black dark:to-[#0F0F0F]">
        <section className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
          <div className="relative w-full hero-section">
            <div className="w-full hero-content">
              <div className="text-center w-full">
                <div className="inline-flex items-center justify-center hero-icon animate-scale-in backdrop-blur-sm">
                  <span className="hero-icon-emoji">📋</span>
                </div>
                <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                  No Proposals Yet
                </h1>
                <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  No proposals have been created yet. Check back later or create the first proposal.
                </p>
                <Link
                  href="/governance"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] text-white font-bold py-3 sm:py-4 md:py-5 px-8 sm:px-10 md:px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base sm:text-lg md:text-xl animate-fade-in"
                  style={{ animationDelay: '300ms' }}
                >
                  Go to Governance →
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
                <span className="hero-icon-emoji">📋</span>
              </div>
              <h1 className="hero-title text-black dark:text-white mb-6 sm:mb-8 md:mb-10 tracking-tight animate-slide-up">
                Proposals
              </h1>
              <p className="hero-subtitle text-black/60 dark:text-white/60 mb-8 sm:mb-10 md:mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
                View and track all governance proposals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
            <div className="w-full" style={{ maxWidth: 'min(95%, 800px)' }}>
              <ProposalFilters
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proposals Grid - Fluid Width */}
      <section className="w-full section-container">
        <div className="w-full section-content">
          {proposalIds.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {proposalIds.map((id, index) => (
                <div key={id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProposalItem
                    proposalId={id}
                    showVoteButton={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="inline-flex items-center justify-center hero-icon mb-6 sm:mb-8">
                <span className="hero-icon-emoji">🔍</span>
              </div>
              <h3 className="feature-title text-black dark:text-white mb-3 sm:mb-4">
                No Proposals Found
              </h3>
              <p className="hero-subtitle text-black/60 dark:text-white/60">
                No proposals match your current filters. Try adjusting your criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
