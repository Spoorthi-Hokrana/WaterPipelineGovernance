"use client";

import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { waterPipelineContract } from "@/lib/contract/config";
import { useActiveAccount } from "thirdweb/react";

/**
 * Hook for milestone-related contract interactions
 */
export function useMilestoneActions() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  /**
   * Add a milestone to a proposal (Admin only)
   */
  const addMilestone = async (
    proposalId: number,
    description: string,
    targetDate: Date,
    releaseAmount: string // Amount in DEV as string (Moonbase Alpha native currency)
  ) => {
    if (!account) {
      throw new Error("No active account");
    }

    // Convert date to timestamp
    const targetTimestamp = BigInt(Math.floor(targetDate.getTime() / 1000));
    
    // Convert DEV to Wei (smallest unit)
    const releaseAmountInWei = BigInt(Math.floor(parseFloat(releaseAmount) * 1e18));

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "addMilestone",
      params: [BigInt(proposalId), description, targetTimestamp, releaseAmountInWei],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Milestone added successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to add milestone:", error);
          reject(error);
        },
      });
    });
  };

  /**
   * Complete a milestone (Admin only)
   */
  const completeMilestone = async (proposalId: number, milestoneId: number) => {
    if (!account) {
      throw new Error("No active account");
    }

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "completeMilestone",
      params: [BigInt(proposalId), BigInt(milestoneId)],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Milestone completed successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to complete milestone:", error);
          reject(error);
        },
      });
    });
  };

  return {
    addMilestone,
    completeMilestone,
    isPending,
  };
}
