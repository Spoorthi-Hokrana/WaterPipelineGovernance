"use client";

import { useReadContract } from "thirdweb/react";
import { waterPipelineContract } from "@/lib/contract/config";
import { ProposalCard } from "./ProposalCard";
import { transformProposal } from "@/utils/proposalTransform";

interface ProposalItemProps {
  proposalId: number;
  showVoteButton?: boolean;
}

export function ProposalItem({ proposalId, showVoteButton = true }: ProposalItemProps) {
  const { data: rawProposal, isLoading } = useReadContract({
    contract: waterPipelineContract,
    method: "proposals",
    params: [BigInt(proposalId)],
  });

  if (isLoading) {
    return <ProposalCardSkeleton />;
  }

  // Transform the raw contract data to our Proposal interface
  const proposal = transformProposal(rawProposal, proposalId);

  if (!proposal) {
    return null;
  }

  return (
    <ProposalCard
      proposal={proposal}
      showVoteButton={showVoteButton}
    />
  );
}

function ProposalCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-8 border-2 border-[#E5E5E5] dark:border-[#2A2A2A] animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-1/3"></div>
        <div className="h-4 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-full"></div>
        <div className="h-4 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-2/3"></div>
        <div className="h-3 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded w-full"></div>
      </div>
    </div>
  );
}

