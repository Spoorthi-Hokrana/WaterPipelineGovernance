"use client";

import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { waterPipelineContract, VoterType } from "@/lib/contract/config";
import { useActiveAccount } from "thirdweb/react";
import { useTransaction } from "@/hooks/ui/useTransaction";
import { useLogger } from "@/utils/debug/logger";

/**
 * Hook for voter-related contract interactions
 */
export function useVoterActions() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending: isSending } = useSendTransaction();
  const transaction = useTransaction();
  const log = useLogger("useVoterActions");

  /**
   * Register a new voter (Admin only)
   */
  const registerVoter = async (
    voterAddress: string, 
    voterType: VoterType, 
    weight: number
  ) => {
    if (!account) {
      const error = new Error("No active account");
      log.error("registerVoter failed", error, { voterAddress, voterType, weight });
      throw error;
    }

    log.info("Starting voter registration", { voterAddress, voterType, weight, admin: account.address });
    log.userAction("registerVoter", account.address, { voterAddress, voterType, weight });

    return transaction.executeTransaction(
      async () => {
        const contractCall = prepareContractCall({
          contract: waterPipelineContract,
          method: "registerVoter",
          params: [voterAddress, voterType, BigInt(weight)],
        });

        log.contractCall("registerVoter", [voterAddress, voterType, BigInt(weight)]);

        return new Promise((resolve, reject) => {
          sendTransaction(contractCall, {
            onSuccess: (result) => {
              log.info("Voter registered successfully", { result, voterAddress });
              log.contractCall("registerVoter", [voterAddress, voterType, BigInt(weight)], result.transactionHash);
              resolve(result);
            },
            onError: (error) => {
              log.error("Failed to register voter", error, { voterAddress, voterType, weight });
              reject(error);
            },
          });
        });
      },
      {
        loadingMessage: "Registering voter...",
        successMessage: "Voter registered successfully!",
        errorMessage: "Failed to register voter",
      }
    );
  };

  /**
   * Cast a vote on a proposal
   */
  const vote = async (proposalId: number, support: boolean) => {
    if (!account) {
      throw new Error("No active account");
    }

    return transaction.executeTransaction(
      async () => {
        const contractCall = prepareContractCall({
          contract: waterPipelineContract,
          method: "vote",
          params: [BigInt(proposalId), support],
        });

        return new Promise((resolve, reject) => {
          sendTransaction(contractCall, {
            onSuccess: (result) => {
              console.log("Vote cast successfully:", result);
              resolve(result);
            },
            onError: (error) => {
              console.error("Failed to cast vote:", error);
              reject(error);
            },
          });
        });
      },
      {
        loadingMessage: `Casting ${support ? "YES" : "NO"} vote...`,
        successMessage: `Vote cast successfully: ${support ? "YES" : "NO"}`,
        errorMessage: "Failed to cast vote",
      }
    );
  };

  return {
    registerVoter,
    vote,
    isPending: isSending || transaction.isLoading,
    transactionState: transaction,
  };
}
