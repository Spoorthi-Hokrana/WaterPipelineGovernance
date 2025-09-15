"use client";

import { useState } from "react";
import { useProposalActions, useGovernanceContract, getProposalStatusText, ProposalStatus } from "@/hooks/contract";
import { formatTimestamp, getTimeRemaining } from "@/utils/contractUtils";

export function ProposalFinalization() {
  const { finalizeProposal, isPending } = useProposalActions();
  const { proposalCount, getProposal } = useGovernanceContract();
  const [selectedProposalId, setSelectedProposalId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const { proposal, isLoading } = getProposal(parseInt(selectedProposalId) || 0);

  const canFinalize = proposal && 
    proposal.status === ProposalStatus.Active && 
    !getTimeRemaining(proposal.votingDeadline).includes("remaining");

  const handleFinalize = async () => {
    const proposalId = parseInt(selectedProposalId);
    if (!proposalId || !proposal) return;

    setError("");
    setSuccessMessage("");

    try {
      await finalizeProposal(proposalId);
      setSuccessMessage("Proposal finalized successfully!");
    } catch (error) {
      console.error("Failed to finalize proposal:", error);
      setError("Failed to finalize proposal. Please try again.");
    }
  };

  const getProposalOptions = () => {
    const count = Number(proposalCount) || 0;
    const options = [];
    for (let i = 1; i <= count; i++) {
      options.push(
        <option key={i} value={i}>
          Proposal #{i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Finalize Proposal
      </h3>

      <div className="space-y-4">
        {/* Proposal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Proposal
          </label>
          <select
            value={selectedProposalId}
            onChange={(e) => setSelectedProposalId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a proposal...</option>
            {getProposalOptions()}
          </select>
        </div>

        {/* Proposal Details */}
        {selectedProposalId && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {isLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading proposal...</p>
            ) : proposal ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Description:</span>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{proposal.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {getProposalStatusText(proposal.status)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Deadline:</span>
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatTimestamp(proposal.votingDeadline)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Yes Votes:</span>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {proposal.yesVotes.toString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">No Votes:</span>
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      {proposal.noVotes.toString()}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Time Status:</span>
                  <p className={`mt-1 ${
                    getTimeRemaining(proposal.votingDeadline).includes("remaining")
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {getTimeRemaining(proposal.votingDeadline)}
                  </p>
                </div>

                {/* Voting Result Preview */}
                {proposal.status === ProposalStatus.Active && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Predicted Result:
                    </p>
                    <p className={`text-sm ${
                      proposal.yesVotes > proposal.noVotes
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {proposal.yesVotes > proposal.noVotes ? "WILL PASS" : "WILL FAIL"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-600 dark:text-red-400">Proposal not found</p>
            )}
          </div>
        )}

        {/* Finalize Button */}
        <button
          onClick={handleFinalize}
          disabled={!canFinalize || isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isPending ? "Finalizing..." : "Finalize Proposal"}
        </button>

        {/* Status Messages */}
        {!canFinalize && proposal && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {proposal.status !== ProposalStatus.Active
              ? "Proposal is not active"
              : "Voting period has not ended yet"
            }
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
