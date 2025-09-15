import { ethers } from "ethers";

/**
 * Utility functions for blockchain interactions
 */

/**
 * Format wallet address for display (shows first 6 and last 4 characters)
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | number): string {
  try {
    return ethers.utils.formatEther(wei);
  } catch {
    return "0";
  }
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string | number): string {
  try {
    return ethers.utils.parseEther(ether.toString()).toString();
  } catch {
    return "0";
  }
}

/**
 * Check if user is connected to the correct network
 */
export function isCorrectNetwork(chainId: number, expectedChainId: number): boolean {
  return chainId === expectedChainId;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: "Ethereum Mainnet",
    11155111: "Sepolia Testnet",
    137: "Polygon Mainnet",
    80001: "Polygon Mumbai Testnet",
  };
  
  return networks[chainId] || `Unknown Network (${chainId})`;
}
