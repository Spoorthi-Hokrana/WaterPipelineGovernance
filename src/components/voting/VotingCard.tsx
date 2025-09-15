"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useVoterActions, useGovernanceContract, Proposal, getVoterTypeText } from "@/hooks/contract";
import { weiToEth, formatTimestamp, getTimeRemaining, getVotingProgress } from "@/utils/contractUtils";

interface VotingCardProps {
  proposal: Proposal;
  onVoteSuccess?: () => void;
}

export function VotingCard({ proposal, onVoteSuccess }: VotingCardProps) {
  const account = useActiveAccount();
  const { vote, isPending } = useVoterActions();
  const { getVoter } = useGovernanceContract();
  const [selectedVote, setSelectedVote] = useState<boolean | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const { voter } = getVoter(account?.address || "");
  const { yesPercentage, noPercentage, totalVotes } = getVotingProgress(
    proposal.yesVotes,
    proposal.noVotes
  );

  const timeRemaining = getTimeRemaining(proposal.votingDeadline);
  const hasEnded = !timeRemaining.includes("remaining");
  const canVote = voter?.exists && !hasEnded && !voteSubmitted;

  const handleVoteClick = (support: boolean) => {
    setSelectedVote(support);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    if (selectedVote === null || !canVote) return;

    try {
      await vote(Number(proposal.id), selectedVote);
      setVoteSubmitted(true);
      setShowConfirmation(false);
      onVoteSuccess?.();
    } catch (error) {
      console.error("Failed to cast vote:", error);
      setShowConfirmation(false);
    }
  };

  if (!account) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Wallet Connection Required
          </h3>
          <p className="text-yellow-700">
            Please connect your wallet to participate in voting.
          </p>
        </div>
      </div>
    );
  }

  if (!voter?.exists) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Not Registered to Vote
          </h3>
          <p className="text-red-700 mb-4">
            You are not registered as a voter for this governance system.
          </p>
          <p className="text-sm text-red-600">
            Contact an administrator to register as a voter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      {/* Proposal Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Proposal #{proposal.id.toString()}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {proposal.description}
        </p>
      </div>

      {/* Proposal Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Funds Escrowed:</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {weiToEth(proposal.fundsEscrowed)} ETH
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Voting Deadline:</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTimestamp(proposal.votingDeadline)}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Remaining:</span>
          <p className={`text-lg font-semibold ${
            hasEnded ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
          }`}>
            {timeRemaining}
          </p>
        </div>
      </div>

      {/* Voter Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Your Voting Power</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Voter Type:</span>
            <p className="font-medium text-blue-900 dark:text-blue-100">
              {getVoterTypeText(voter.voterType)}
            </p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Voting Weight:</span>
            <p className="font-medium text-blue-900 dark:text-blue-100">
              {voter.weight.toString()}
            </p>
          </div>
        </div>
      </div>

      {/* Current Voting Results */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Current Results</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalVotes.toString()} total votes
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
          <div className="flex h-full rounded-full overflow-hidden">
            <div
              className="bg-green-500 flex items-center justify-center"
              style={{ width: `${yesPercentage}%` }}
            >
              {yesPercentage > 10 && (
                <span className="text-white text-xs font-medium">
                  {yesPercentage}%
                </span>
              )}
            </div>
            <div
              className="bg-red-500 flex items-center justify-center"
              style={{ width: `${noPercentage}%` }}
            >
              {noPercentage > 10 && (
                <span className="text-white text-xs font-medium">
                  {noPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-green-600 dark:text-green-400">
            ✅ Yes: {proposal.yesVotes.toString()} votes
          </span>
          <span className="text-red-600 dark:text-red-400">
            ❌ No: {proposal.noVotes.toString()} votes
          </span>
        </div>
      </div>

      {/* Voting Buttons */}
      {canVote && !showConfirmation ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleVoteClick(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="text-xl mr-2">✅</span>
            Vote Yes
          </button>
          <button
            onClick={() => handleVoteClick(false)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="text-xl mr-2">❌</span>
            Vote No
          </button>
        </div>
      ) : showConfirmation ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Confirm Your Vote
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            You are about to cast a <strong>{selectedVote ? "YES" : "NO"}</strong> vote 
            with a weight of <strong>{voter.weight.toString()}</strong>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmVote}
              disabled={isPending}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isPending ? "Casting Vote..." : "Confirm Vote"}
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : voteSubmitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
            Vote Submitted Successfully!
          </h3>
          <p className="text-green-800 dark:text-green-200">
            Your vote has been recorded on the blockchain.
          </p>
        </div>
      ) : hasEnded ? (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">⏰</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Voting Period Ended
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The voting period for this proposal has ended.
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🚫</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Cannot Vote
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You cannot vote on this proposal.
          </p>
        </div>
      )}
    </div>
  );
}
