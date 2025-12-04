"use client";

import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { waterPipelineContract } from "@/lib/contract/config";
import { useActiveAccount } from "thirdweb/react";
import { ethToWei, decodeRevertReason, getTransactionErrorMessage } from "@/utils/contractUtils";

/**
 * Hook for proposal-related contract interactions
 */
export function useProposalActions() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  /**
   * Create a new proposal (Admin only) - NOT payable, fundsEscrowed is just a parameter
   */
  const createProposal = async (
    description: string,
    contractAddress: string,
    fundsEscrowed: string // Amount in DEV as string
  ) => {
    if (!account) {
      throw new Error("No active account");
    }

    // Validate inputs
    if (!description || description.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }
    
    if (!contractAddress || contractAddress.trim().length !== 42 || !contractAddress.startsWith('0x')) {
      throw new Error("Invalid contractor address format");
    }

    // Convert DEV to Wei for the fundsEscrowed parameter
    const fundsInWei = ethToWei(fundsEscrowed);
    
    if (fundsInWei === BigInt(0) && parseFloat(fundsEscrowed) > 0) {
      throw new Error(`Invalid funds amount: ${fundsEscrowed} DEV. Please enter a valid number.`);
    }

    // Verify contract address is set
    if (waterPipelineContract.address === "0x0000000000000000000000000000000000000000") {
      throw new Error("Contract address not set! Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
    }

    // Prepare contract call - contract is NOT payable, so no value parameter needed
    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "createProposal",
      params: [description, contractAddress, fundsInWei],
    });

    // Verify the transaction object has the value property set
    // Thirdweb's prepareContractCall should include this
    const transactionHasValue = transaction && (transaction as any).value !== undefined;
    
    // Log the prepared transaction details for debugging
    console.log("📝 Transaction prepared:", {
      fundsEscrowedDev: fundsEscrowed,
      fundsInWei: fundsInWei.toString(),
      valueSetInTransaction: transactionHasValue,
      transactionValue: transactionHasValue ? (transaction as any).value?.toString() : "NOT ACCESSIBLE",
      contractAddress: contractAddress,
      contractAddressFromConfig: waterPipelineContract.address,
      descriptionLength: description.length,
      note: "⚠️ MetaMask MUST show " + fundsEscrowed + " DEV being sent when you confirm",
    });

    // Double-check we're using the correct contract
    const currentContract = waterPipelineContract.address.toLowerCase();
    const oldContract = "0x85adb25f3269ebe8472e523e8dcb978ceec4c1cf";
    const newContract = "0x71864a1cb9409879fd8b51f4c5a0e09025beec80";
    
    if (currentContract === oldContract) {
      throw new Error(
        "❌ WRONG CONTRACT ADDRESS!\n\n" +
        "The dev server is using the OLD contract: " + currentContract + "\n" +
        "It should be: " + newContract + "\n\n" +
        "🔧 FIX: Stop dev server (Ctrl+C), restart it (npm run dev), then refresh browser!"
      );
    }

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          resolve({
            ...result,
            transactionHash: result?.transactionHash || result?.hash || result?.receipt?.transactionHash,
          });
        },
        onError: (error: any) => {
          // Filter out harmless analytics errors before logging
          const errorStr = JSON.stringify(error || "").toLowerCase();
          const isHarmless = errorStr.includes("thirdweb.com/event") || 
                             errorStr.includes("social.thirdweb.com") ||
                             (errorStr.includes("401") && errorStr.includes("thirdweb")) ||
                             errorStr.includes("talisman extension") ||
                             errorStr.includes("fijngjgcjhjmmpcmkeiomlglpeiijkld") ||
                             errorStr.includes("continue with onboarding");
          
          if (!isHarmless) {
            // Try to decode the actual revert reason
            const revertReason = decodeRevertReason(error);
            const userFriendlyMessage = getTransactionErrorMessage(error, {
              fundsAmount: fundsEscrowed,
              contractAddress: contractAddress,
              userAddress: account?.address,
            });
            
            const enhancedError = {
              ...error,
              decodedReason: revertReason,
              userFriendlyMessage: userFriendlyMessage,
            };
            reject(enhancedError);
          } else {
            // For harmless errors, still reject but with original error (Talisman errors are harmless)
            // But we should still show the actual transaction error if it exists
            if (errorStr.includes("talisman")) {
              // Talisman error is harmless, but there might be a real error underneath
              // Check if there's a nested error
              if (error?.error) {
                reject(error.error);
              } else {
                // Silently fail for pure Talisman errors
                reject(new Error("Transaction cancelled or failed. Please try again."));
              }
            } else {
              reject(error);
            }
          }
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

  /**
   * Execute a passed proposal (Admin only)
   */
  const executeProposal = async (proposalId: number) => {
    if (!account) {
      throw new Error("No active account");
    }

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "executeProposal",
      params: [BigInt(proposalId)],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Proposal executed successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to execute proposal:", error);
          reject(error);
        },
      });
    });
  };

  /**
   * Withdraw funds from failed proposal (Admin only)
   */
  const withdrawFailedProposalFunds = async (proposalId: number) => {
    if (!account) {
      throw new Error("No active account");
    }

    const transaction = prepareContractCall({
      contract: waterPipelineContract,
      method: "withdrawFailedProposalFunds",
      params: [BigInt(proposalId)],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Funds withdrawn successfully:", result);
          resolve(result);
        },
        onError: (error) => {
          console.error("Failed to withdraw funds:", error);
          reject(error);
        },
      });
    });
  };

  return {
    createProposal,
    finalizeProposal,
    executeProposal,
    withdrawFailedProposalFunds,
    isPending,
  };
}
