"use client";

import Link from "next/link";
import { Proposal, getProposalStatusText, ProposalStatus } from "@/hooks/contract";
import { weiToEth, formatTimestamp, getTimeRemaining, getVotingProgress } from "@/utils/contractUtils";

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
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30";
      case ProposalStatus.Passed:
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30";
      case ProposalStatus.Failed:
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30";
      case ProposalStatus.Executed:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30";
    }
  };

  return (
    <div className="group card-premium p-8 hover:shadow-2xl transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Header with Premium Styling */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-black dark:text-white tracking-tight group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors duration-200">
              Proposal #{proposal.id.toString()}
            </h3>
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(proposal.status)} transition-colors duration-200`}>
            {getProposalStatusText(proposal.status)}
          </span>
        </div>
        <div className="text-left sm:text-right space-y-2">
          <p className="text-base font-semibold text-black dark:text-white">
            💰 {weiToEth(proposal.fundsEscrowed)} ETH
          </p>
          <p className="text-sm text-black/60 dark:text-white/60 font-medium">
            🎯 {proposal.milestoneCount.toString()} milestones
          </p>
        </div>
      </div>

      {/* Description with Hover Underline Effect */}
      <div className="mb-6">
        <p className="text-base text-black/70 dark:text-white/70 line-clamp-3 leading-relaxed font-medium">
          {proposal.description}
        </p>
      </div>

      {/* Voting Progress with Smooth Animation */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
          <span className="text-sm font-semibold text-black dark:text-white">
            Voting Progress
          </span>
          <span className="text-sm text-black/60 dark:text-white/60 font-medium">
            {totalVotes.toString()} total votes
          </span>
        </div>
        
        <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2.5 mb-3 overflow-hidden backdrop-blur-sm">
          <div className="flex h-full rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${yesPercentage}%` }}
            ></div>
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${noPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-2">
          <span className="text-green-600 dark:text-green-400 font-semibold">
            ✅ Yes: {proposal.yesVotes.toString()} ({yesPercentage}%)
          </span>
          <span className="text-red-600 dark:text-red-400 font-semibold">
            ❌ No: {proposal.noVotes.toString()} ({noPercentage}%)
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6 text-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="font-semibold text-black/60 dark:text-white/60">📅 Created:</span>
            <p className="text-black dark:text-white font-medium">{formatTimestamp(proposal.creationTime)}</p>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-black/60 dark:text-white/60">⏰ Deadline:</span>
            <p className="text-black dark:text-white font-medium">{formatTimestamp(proposal.votingDeadline)}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl border border-yellow-500/20 dark:border-yellow-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">⏳ Time Remaining:</span>
              <span className={`font-bold ${hasEnded ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                {timeRemaining}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions with Premium Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/5 dark:border-white/5">
        {showVoteButton && isActive && !hasEnded && (
          <Link
            href={`/voting?proposal=${proposal.id}`}
            className="group/btn flex-1 btn-premium bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] text-white text-center py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🗳️ Vote Now
              <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
            </span>
          </Link>
        )}
        
        <Link
          href={`/proposals/${proposal.id}`}
          className="flex-1 btn-premium border-2 border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:border-black/20 dark:hover:border-white/20"
        >
          👀 View Details
        </Link>
      </div>
    </div>
  );
}

export function ProposalCardSkeleton() {
  return (
    <div className="card-premium p-8">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-6 w-32 rounded-lg"></div>
            <div className="skeleton h-5 w-20 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-5 w-24 rounded"></div>
            <div className="skeleton h-4 w-20 rounded"></div>
          </div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-3/4 rounded"></div>
        </div>
        
        {/* Progress Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="skeleton h-4 w-32 rounded"></div>
            <div className="skeleton h-4 w-20 rounded"></div>
          </div>
          <div className="skeleton h-2.5 w-full rounded-full"></div>
        </div>
        
        {/* Actions Skeleton */}
        <div className="flex gap-3 pt-4 border-t border-black/5 dark:border-white/5">
          <div className="skeleton h-12 flex-1 rounded-xl"></div>
          <div className="skeleton h-12 flex-1 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
