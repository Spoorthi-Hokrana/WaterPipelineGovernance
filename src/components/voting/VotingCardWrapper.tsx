"use client";

import { useReadContract } from "thirdweb/react";
import { waterPipelineContract } from "@/lib/contract/config";
import { VotingCard } from "./VotingCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { transformProposal } from "@/utils/proposalTransform";

interface VotingCardWrapperProps {
  proposalId: number;
  onVoteSuccess?: () => void;
}

export function VotingCardWrapper({ proposalId, onVoteSuccess }: VotingCardWrapperProps) {
  const { data: rawProposal, isLoading } = useReadContract({
    contract: waterPipelineContract,
    method: "proposals",
    params: [BigInt(proposalId)],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // Transform the raw contract data to our Proposal interface
  const proposal = transformProposal(rawProposal, proposalId);

  if (!proposal) {
    return (
      <div className="text-center py-20">
        <p className="text-black/60 dark:text-white/60">Proposal not found</p>
      </div>
    );
  }

  return <VotingCard proposal={proposal} onVoteSuccess={onVoteSuccess} />;
}

