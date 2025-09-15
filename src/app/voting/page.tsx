"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGovernanceContract, ProposalStatus } from "@/hooks/contract";
import { VotingCard } from "@/components/voting/VotingCard";
import { ProposalCard } from "@/components/proposals/ProposalCard";

export default function VotingPage() {
  const searchParams = useSearchParams();
  const { proposalCount, getProposal } = useGovernanceContract();
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get proposal ID from URL params
  useEffect(() => {
    const proposalParam = searchParams.get("proposal");
    if (proposalParam) {
      const id = parseInt(proposalParam);
      if (!isNaN(id)) {
        setSelectedProposalId(id);
      }
    }
  }, [searchParams]);

  // Generate array of proposal IDs for active proposals
  const activeProposalIds = useMemo(() => {
    const count = Number(proposalCount) || 0;
    const ids = [];
    
    for (let i = 1; i <= count; i++) {
      const { proposal } = getProposal(i);
      if (proposal && proposal.status === ProposalStatus.Active) {
        ids.push(i);
      }
    }
    
    return ids;
  }, [proposalCount, getProposal, refreshKey]);

  const selectedProposal = selectedProposalId ? getProposal(selectedProposalId).proposal : null;

  const handleVoteSuccess = () => {
    // Refresh the data after a successful vote
    setRefreshKey(prev => prev + 1);
  };

  if (!proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🗳️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Proposals to Vote On
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are currently no proposals available for voting.
          </p>
          <button
            onClick={() => window.location.href = '/proposals'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View All Proposals
          </button>
        </div>
      </div>
    );
  }

  if (activeProposalIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Active Voting
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are currently no active proposals available for voting.
          </p>
          <button
            onClick={() => window.location.href = '/proposals'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mr-4"
          >
            View All Proposals
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
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
          🗳️ Voting Interface
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Cast your weighted vote on active governance proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Voting Area */}
        <div className="xl:col-span-2">
          {selectedProposal ? (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setSelectedProposalId(null)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  ← Back to proposal list
                </button>
              </div>
              <VotingCard 
                proposal={selectedProposal} 
                onVoteSuccess={handleVoteSuccess}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select a Proposal to Vote On
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose from the active proposals below to cast your vote.
              </p>
              
              <div className="space-y-4">
                {activeProposalIds.map(id => {
                  const { proposal } = getProposal(id);
                  if (!proposal) return null;
                  
                  return (
                    <div 
                      key={id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedProposalId(id)}
                    >
                      <ProposalCard 
                        proposal={proposal} 
                        showVoteButton={false}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Proposals Quick List */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Active Proposals
            </h3>
            <div className="space-y-3">
              {activeProposalIds.map(id => {
                const { proposal } = getProposal(id);
                if (!proposal) return null;
                
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedProposalId(id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedProposalId === id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      Proposal #{id}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {proposal.description.length > 50 
                        ? proposal.description.substring(0, 50) + "..."
                        : proposal.description
                      }
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voting Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Voting Guidelines
            </h3>
            <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Each voter has different voting weights based on their role</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>You can only vote once per proposal</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Voting periods last for 7 days from proposal creation</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Your vote is recorded permanently on the blockchain</span>
              </div>
            </div>
          </div>

          {/* Voting Stats */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Voting Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Proposals:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {activeProposalIds.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Proposals:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Number(proposalCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
