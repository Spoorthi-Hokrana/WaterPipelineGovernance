/**
 * Centralized exports for all contract hooks and utilities
 */

// Main contract hooks
export { useGovernanceContract } from "./useGovernanceContract";
export { useVoterActions } from "./useVoterActions";
export { useProposalActions } from "./useProposalActions";
export { useMilestoneActions } from "./useMilestoneActions";

// Contract configuration and types
export {
  waterPipelineContract,
  CONTRACT_ADDRESS,
  ProposalStatus,
  VoterType,
  type Proposal,
  type Voter,
  type Milestone,
  getProposalStatusText,
  getVoterTypeText,
  formatProposalDeadline,
  isProposalActive,
} from "@/lib/contract/config";

// ABI export
export { WATER_PIPELINE_GOVERNANCE_ABI } from "@/lib/contract/abi";
