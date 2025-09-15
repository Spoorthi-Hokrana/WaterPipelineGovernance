import { getContract } from "thirdweb";
import { client, DEFAULT_CHAIN } from "@/lib/thirdweb";
import { WATER_PIPELINE_GOVERNANCE_ABI } from "./abi";

// Contract address - Update this with your deployed contract address
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Contract instance
export const waterPipelineContract = getContract({
  client,
  chain: DEFAULT_CHAIN,
  address: CONTRACT_ADDRESS,
  abi: WATER_PIPELINE_GOVERNANCE_ABI,
});

// Enums and Types from the contract
export enum ProposalStatus {
  Pending = 0,
  Active = 1,
  Passed = 2,
  Failed = 3,
  Executed = 4,
}

export enum VoterType {
  Municipal = 1,
  Engineer = 2,
  Citizen = 3,
}

// TypeScript interfaces for contract data
export interface Proposal {
  id: bigint;
  description: string;
  creationTime: bigint;
  votingDeadline: bigint;
  status: ProposalStatus;
  yesVotes: bigint;
  noVotes: bigint;
  contractAddress: string;
  fundsEscrowed: bigint;
  milestoneCount: bigint;
}

export interface Voter {
  exists: boolean;
  voterType: VoterType;
  weight: bigint;
}

export interface Milestone {
  description: string;
  targetDate: bigint;
  completed: boolean;
  releaseAmount: bigint;
}

// Contract constants
export const VOTING_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds

// Helper functions
export const getProposalStatusText = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.Pending:
      return "Pending";
    case ProposalStatus.Active:
      return "Active";
    case ProposalStatus.Passed:
      return "Passed";
    case ProposalStatus.Failed:
      return "Failed";
    case ProposalStatus.Executed:
      return "Executed";
    default:
      return "Unknown";
  }
};

export const getVoterTypeText = (type: VoterType): string => {
  switch (type) {
    case VoterType.Municipal:
      return "Municipal Official";
    case VoterType.Engineer:
      return "Engineer";
    case VoterType.Citizen:
      return "Citizen";
    default:
      return "Unknown";
  }
};

export const formatProposalDeadline = (deadline: bigint): string => {
  const deadlineDate = new Date(Number(deadline) * 1000);
  return deadlineDate.toLocaleDateString() + " " + deadlineDate.toLocaleTimeString();
};

export const isProposalActive = (deadline: bigint): boolean => {
  return Date.now() / 1000 < Number(deadline);
};
