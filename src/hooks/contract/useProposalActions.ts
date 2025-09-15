"use client";

import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { waterPipelineContract } from "@/lib/contract/config";
import { useActiveAccount } from "thirdweb/react";

/**
 * Hook for proposal-related contract interactions
 */
export function useProposalActions() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  /**
   * Create a new proposal (Admin only)
   */
  const createProposal = async (
    description: string,
    contractAddress: string,
    fundsEscrowed: string // Amount in ETH as string
  ) => {
    if (!account) {
      throw new Error("No active account");
    }

    // Convert ETH to Wei
    const fundsInWei = BigInt(Math.floor(parseFloat(fundsEscrowed) * 1e18));

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "createProposal",
      params: [description, contractAddress, fundsInWei],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Proposal created successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to create proposal:", error);
          reject(error);
        },
      });
    });
  };

  /**
   * Finalize a proposal (Admin only)
   */
  const finalizeProposal = async (proposalId: number) => {
    if (!account) {
      throw new Error("No active account");
    }

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "finalizeProposal",
      params: [BigInt(proposalId)],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Proposal finalized successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to finalize proposal:", error);
          reject(error);
        },
      });
    });
  };

  return {
    createProposal,
    finalizeProposal,
    isPending,
  };
}
