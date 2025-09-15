"use client";

import { useState, useMemo } from "react";
import { useGovernanceContract, ProposalStatus, getProposalStatusText } from "@/hooks/contract";
import { MilestoneManager } from "@/components/milestones/MilestoneManager";
import { weiToEth, formatTimestamp } from "@/utils/contractUtils";

export default function MilestonesPage() {
  const { proposalCount, getProposal } = useGovernanceContract();
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get all passed proposals that can have milestones
  const passedProposals = useMemo(() => {
    const count = Number(proposalCount) || 0;
    const proposals = [];
    
    for (let i = 1; i <= count; i++) {
      const { proposal } = getProposal(i);
      if (proposal && proposal.status === ProposalStatus.Passed) {
        proposals.push(proposal);
      }
    }
    
    return proposals;
  }, [proposalCount, getProposal, refreshKey]);

  const selectedProposal = selectedProposalId ? getProposal(selectedProposalId).proposal : null;

  const handleMilestoneUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!proposalCount || Number(proposalCount) === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Proposals Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are no proposals in the system yet. Milestones can only be added to passed proposals.
          </p>
          <button
            onClick={() => window.location.href = '/proposals'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Proposals
          </button>
        </div>
      </div>
    );
  }

  if (passedProposals.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            No Passed Proposals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There are currently no passed proposals that can have milestones. 
            Milestones can only be added to proposals that have been approved through voting.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/proposals'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              View All Proposals
            </button>
            <button
              onClick={() => window.location.href = '/voting'}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Vote on Active Proposals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Milestone Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track project milestones for passed proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2">
          {selectedProposal ? (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setSelectedProposalId(null)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                ← Back to proposal list
              </button>

              {/* Proposal Details */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Proposal #{selectedProposal.id.toString()}
                    </h2>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {getProposalStatusText(selectedProposal.status)}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Total Funds: {weiToEth(selectedProposal.fundsEscrowed)} ETH</p>
                    <p>Milestones: {selectedProposal.milestoneCount.toString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description:</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedProposal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Created:</span>
                    <p className="text-gray-900 dark:text-white">{formatTimestamp(selectedProposal.creationTime)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Contractor:</span>
                    <p className="text-gray-900 dark:text-white font-mono text-xs">
                      {selectedProposal.contractAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestone Manager */}
              <MilestoneManager 
                proposalId={Number(selectedProposal.id)}
                onMilestoneAdded={handleMilestoneUpdate}
              />

              {/* Existing Milestones Display */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Milestones
                </h3>
                
                {Number(selectedProposal.milestoneCount) === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Milestones Yet
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Add milestones to break down this project into manageable phases.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Note: In a real implementation, you'd fetch and display actual milestone data */}
                    <div className="text-center py-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-4xl mb-4">🚧</div>
                      <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Milestone Display Coming Soon
                      </h4>
                      <p className="text-blue-700 dark:text-blue-200">
                        Individual milestone details will be displayed here. 
                        Currently showing {selectedProposal.milestoneCount.toString()} milestone(s).
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select a Proposal to Manage Milestones
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose from the passed proposals below to add and manage milestones.
              </p>
              
              <div className="space-y-4">
                {passedProposals.map(proposal => (
                  <div 
                    key={proposal.id.toString()}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedProposalId(Number(proposal.id))}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Proposal #{proposal.id.toString()}
                        </h3>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {getProposalStatusText(proposal.status)}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        <p>Funds: {weiToEth(proposal.fundsEscrowed)} ETH</p>
                        <p>Milestones: {proposal.milestoneCount.toString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                      {proposal.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <span>Created: {formatTimestamp(proposal.creationTime)}</span>
                      <span className="text-blue-600 dark:text-blue-400 hover:underline">
                        Manage Milestones →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Milestone Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Passed Proposals:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {passedProposals.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Milestones:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {passedProposals.reduce((sum, p) => sum + Number(p.milestoneCount), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Funds:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {passedProposals.reduce((sum, p) => sum + parseFloat(weiToEth(p.fundsEscrowed)), 0).toFixed(2)} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Available Proposals */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Proposals
            </h3>
            <div className="space-y-2">
              {passedProposals.map(proposal => (
                <button
                  key={proposal.id.toString()}
                  onClick={() => setSelectedProposalId(Number(proposal.id))}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedProposalId === Number(proposal.id)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    Proposal #{proposal.id.toString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {proposal.milestoneCount.toString()} milestone(s)
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
              Milestone Guidelines
            </h3>
            <div className="space-y-3 text-sm text-purple-800 dark:text-purple-200">
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                <span>Break projects into logical phases</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                <span>Set realistic target dates</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                <span>Distribute funds across milestones</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                <span>Mark completion to release funds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
