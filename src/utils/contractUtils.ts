/**
 * Utility functions for contract data formatting and validation
 */

import { ethers } from "ethers";

/**
 * Convert Wei to ETH string
 */
export function weiToEth(wei: bigint): string {
  try {
    return ethers.utils.formatEther(wei.toString());
  } catch {
    return "0";
  }
}

/**
 * Convert ETH string to Wei
 */
export function ethToWei(eth: string): bigint {
  try {
    return BigInt(ethers.utils.parseEther(eth).toString());
  } catch {
    return BigInt(0);
  }
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * Check if proposal is still active (before deadline)
 */
export function isProposalActive(deadline: bigint): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now < Number(deadline);
}

/**
 * Calculate time remaining for proposal
 */
export function getTimeRemaining(deadline: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const timeLeft = Number(deadline) - now;

  if (timeLeft <= 0) {
    return "Voting ended";
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}

/**
 * Calculate voting progress percentage
 */
export function getVotingProgress(yesVotes: bigint, noVotes: bigint): {
  yesPercentage: number;
  noPercentage: number;
  totalVotes: bigint;
} {
  const total = yesVotes + noVotes;
  
  if (total === BigInt(0)) {
    return { yesPercentage: 0, noPercentage: 0, totalVotes: BigInt(0) };
  }

  const yesPercentage = Number((yesVotes * BigInt(100)) / total);
  const noPercentage = Number((noVotes * BigInt(100)) / total);

  return { yesPercentage, noPercentage, totalVotes: total };
}

/**
 * Validate Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Ethereum address (alias for component compatibility)
 */
export function validateEthereumAddress(address: string): boolean {
  return isValidEthereumAddress(address);
}

/**
 * Validate proposal description
 */
export function validateProposalDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  if (!description.trim()) {
    return { isValid: false, error: "Description is required" };
  }
  
  if (description.length < 10) {
    return { isValid: false, error: "Description must be at least 10 characters" };
  }
  
  if (description.length > 500) {
    return { isValid: false, error: "Description must be less than 500 characters" };
  }
  
  return { isValid: true };
}

/**
 * Validate ETH amount
 */
export function validateEthAmount(amount: string): {
  isValid: boolean;
  error?: string;
} {
  if (!amount.trim()) {
    return { isValid: false, error: "Amount is required" };
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: "Invalid amount format" };
  }
  
  if (numAmount < 0) {
    return { isValid: false, error: "Amount must be positive" };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, error: "Amount is too large" };
  }
  
  return { isValid: true };
}

/**
 * Validate voter weight
 */
export function validateVoterWeight(weight: number): {
  isValid: boolean;
  error?: string;
} {
  if (weight < 1) {
    return { isValid: false, error: "Weight must be at least 1" };
  }
  
  if (weight > 1000) {
    return { isValid: false, error: "Weight cannot exceed 1000" };
  }
  
  return { isValid: true };
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number | bigint): string {
  return num.toLocaleString();
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generate proposal summary for display
 */
export function generateProposalSummary(description: string): string {
  return truncateText(description, 100);
}
