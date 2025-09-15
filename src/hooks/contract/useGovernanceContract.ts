"use client";

import { useReadContract, useSimulateContract } from "thirdweb/react";
import { waterPipelineContract } from "@/lib/contract/config";
import type { Proposal, Voter } from "@/lib/contract/config";

/**
 * Hook for reading contract data
 */
export function useGovernanceContract() {
  // Read admin address
  const { data: admin, isLoading: adminLoading } = useReadContract({
    contract: waterPipelineContract,
    method: "admin",
  });

  // Read proposal count
  const { data: proposalCount, isLoading: proposalCountLoading } = useReadContract({
    contract: waterPipelineContract,
    method: "proposalCount",
  });

  // Function to get proposal by ID
  const getProposal = (proposalId: number) => {
    const { data, isLoading, error } = useReadContract({
      contract: waterPipelineContract,
      method: "proposals",
      params: [BigInt(proposalId)],
    });

    return {
      proposal: data as Proposal | undefined,
      isLoading,
      error,
    };
  };

  // Function to get voter by address
  const getVoter = (voterAddress: string) => {
    const { data, isLoading, error } = useReadContract({
      contract: waterPipelineContract,
      method: "voters",
      params: [voterAddress],
    });

    return {
      voter: data as Voter | undefined,
      isLoading,
      error,
    };
  };

  // Function to check if address has access (everyone has access now)
  const hasAccess = (address: string): boolean => {
    // Everyone who connects their wallet has full access
    return !!address;
  };

  return {
    admin,
    adminLoading,
    proposalCount,
    proposalCountLoading,
    getProposal,
    getVoter,
    hasAccess,
    // Legacy compatibility - everyone has access
    isAdmin: hasAccess,
  };
}
