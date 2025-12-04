import type { Proposal } from "@/lib/contract/config";
import { ProposalStatus } from "@/lib/contract/config";

/**
 * Transform raw contract proposal data into our Proposal interface
 * Handles both array and object formats from thirdweb
 */
export function transformProposal(
  rawData: any,
  proposalId?: number | bigint
): Proposal | null {
  if (!rawData) {
    return null;
  }

  // Always use the proposalId parameter if provided (it's the mapping key)
  const id = proposalId ? BigInt(proposalId) : BigInt(0);

  // Helper to safely access array/object values
  const getValue = (index: number, fallback: any = null) => {
    if (Array.isArray(rawData)) {
      return rawData[index] !== undefined ? rawData[index] : fallback;
    }
    if (typeof rawData === "object") {
      // Try named property first
      const propNames = [
        "id", "description", "creationTime", "votingDeadline", "status",
        "yesVotes", "noVotes", "contractAddress", "fundsEscrowed", "milestoneCount"
      ];
      const propName = propNames[index];
      if (rawData[propName] !== undefined) {
        return rawData[propName];
      }
      // Try numeric key (e.g., "0", "1", etc.)
      if (rawData[index] !== undefined || rawData[String(index)] !== undefined) {
        return rawData[index] ?? rawData[String(index)];
      }
    }
    return fallback;
  };

  // Handle array format (tuple return) or object with numeric keys
  if (Array.isArray(rawData) || typeof rawData === "object") {
    return {
      id,
      description: getValue(1, "") || "",
      creationTime: BigInt(getValue(2, 0) || 0),
      votingDeadline: BigInt(getValue(3, 0) || 0),
      status: (getValue(4, ProposalStatus.Pending) as ProposalStatus) || ProposalStatus.Pending,
      yesVotes: BigInt(getValue(5, 0) || 0),
      noVotes: BigInt(getValue(6, 0) || 0),
      contractAddress: getValue(7, "") || "",
      fundsEscrowed: BigInt(getValue(8, 0) || 0),
      milestoneCount: BigInt(getValue(9, 0) || 0),
    };
  }

  return null;
}

