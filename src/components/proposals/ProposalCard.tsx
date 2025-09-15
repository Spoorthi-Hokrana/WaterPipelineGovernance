"use client";

import Link from "next/link";
import { Proposal, getProposalStatusText, ProposalStatus } from "@/hooks/contract";
import { weiToEth, formatTimestamp, getTimeRemaining, getVotingProgress } from "@/utils/contractUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ProposalCardProps {
  proposal: Proposal;
  showVoteButton?: boolean;
  isLoading?: boolean;
}

export function ProposalCard({ proposal, showVoteButton = true, isLoading = false }: ProposalCardProps) {
  if (isLoading) {
    return <ProposalCardSkeleton />;
  }

  const { yesPercentage, noPercentage, totalVotes } = getVotingProgress(
    proposal.yesVotes,
    proposal.noVotes
  );

  const isActive = proposal.status === ProposalStatus.Active;
  const timeRemaining = getTimeRemaining(proposal.votingDeadline);
  const hasEnded = !timeRemaining.includes("remaining");

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case ProposalStatus.Passed:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case ProposalStatus.Failed:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case ProposalStatus.Executed:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Proposal #{proposal.id.toString()}
          </h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
            {getProposalStatusText(proposal.status)}
          </span>
        </div>
        <div className="text-left sm:text-right text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p className="font-medium">💰 {weiToEth(proposal.fundsEscrowed)} ETH</p>
          <p>🎯 {proposal.milestoneCount.toString()} milestones</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
          {proposal.description}
        </p>
      </div>

      {/* Voting Progress */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-1 sm:space-y-0">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Voting Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalVotes.toString()} total votes
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${yesPercentage}%` }}
            ></div>
            <div
              className="bg-red-500 transition-all duration-300 ease-out"
              style={{ width: `${noPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm space-y-1 sm:space-y-0">
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✅ Yes: {proposal.yesVotes.toString()} ({yesPercentage}%)
          </span>
          <span className="text-red-600 dark:text-red-400 font-medium">
            ❌ No: {proposal.noVotes.toString()} ({noPercentage}%)
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div>
            <span className="font-medium">📅 Created:</span>
            <p className="truncate">{formatTimestamp(proposal.creationTime)}</p>
          </div>
          <div>
            <span className="font-medium">⏰ Deadline:</span>
            <p className="truncate">{formatTimestamp(proposal.votingDeadline)}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-2">
              <span className="font-medium">⏳ Time Remaining:</span>
              <span className={`font-bold ${hasEnded ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
                {timeRemaining}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showVoteButton && isActive && !hasEnded && (
          <Link
            href={`/voting?proposal=${proposal.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            🗳️ Vote Now
          </Link>
        )}
        
        <Link
          href={`/proposals/${proposal.id}`}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-center py-2 px-4 rounded-md transition-all duration-200 font-medium"
        >
          👀 View Details
        </Link>
      </div>
    </div>
  );
}

export function ProposalCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
      </div>
    </div>
  );
}
