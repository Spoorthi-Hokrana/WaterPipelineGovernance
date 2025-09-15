"use client";

import { useState, useMemo } from "react";
import { useGovernanceContract, ProposalStatus, type Proposal } from "@/hooks/contract";
import { ProposalCard } from "@/components/proposals/ProposalCard";
import { ProposalFilters } from "@/components/proposals/ProposalFilters";

export default function ProposalsPage() {
  const { proposalCount, getProposal } = useGovernanceContract();
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deadline">("newest");

  // Generate array of proposal IDs
  const proposalIds = useMemo(() => {
    const count = Number(proposalCount) || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [proposalCount]);

  // Fetch all proposals (in a real app, you'd want pagination)
  const proposals = useMemo(() => {
    const proposalData: Proposal[] = [];
    
    proposalIds.forEach(id => {
      const { proposal } = getProposal(id);
      if (proposal) {
        proposalData.push(proposal);
      }
    });

    return proposalData;
  }, [proposalIds, getProposal]);

  // Filter and sort proposals
  const filteredAndSortedProposals = useMemo(() => {
    let filtered = proposals;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(proposal => proposal.status === selectedStatus);
    }

    // Sort proposals
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.creationTime) - Number(a.creationTime);
        case "oldest":
          return Number(a.creationTime) - Number(b.creationTime);
        case "deadline":
          return Number(a.votingDeadline) - Number(b.votingDeadline);
        default:
          return 0;
      }
    });

    return sorted;
  }, [proposals, selectedStatus, sortBy]);

  if (!proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Proposals Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No proposals have been created yet. Check back later or contact an admin to create the first proposal.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📋 Proposals Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and track all governance proposals for water pipeline management.
        </p>
      </div>

      {/* Filters */}
      <ProposalFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Number(proposalCount)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🔵</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {proposals.filter(p => p.status === ProposalStatus.Active).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {proposals.filter(p => p.status === ProposalStatus.Passed).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">❌</div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {proposals.filter(p => p.status === ProposalStatus.Failed).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredAndSortedProposals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id.toString()}
              proposal={proposal}
              showVoteButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Proposals Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No proposals match your current filters. Try adjusting your filter criteria.
          </p>
        </div>
      )}

      {/* Loading State */}
      {proposals.length === 0 && Number(proposalCount) > 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading proposals...</p>
        </div>
      )}
    </div>
  );
}
