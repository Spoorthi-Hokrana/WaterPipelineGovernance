/**
 * Utility functions for contract data formatting and validation
 */

import { ethers } from "ethers";

/**
 * Convert Wei to native currency string (DEV on Moonbase Alpha, ETH on mainnet)
 */
export function weiToEth(wei: bigint): string {
  try {
    return ethers.utils.formatEther(wei.toString());
  } catch {
    return "0";
  }
}

/**
 * Convert native currency string to Wei (DEV on Moonbase Alpha, ETH on mainnet)
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
export function getVotingProgress(yesVotes: bigint | number | string | undefined, noVotes: bigint | number | string | undefined): {
  yesPercentage: number;
  noPercentage: number;
  totalVotes: bigint;
} {
  // Helper function to safely convert to BigInt
  const toBigInt = (value: bigint | number | string | undefined): bigint => {
    if (value === undefined || value === null) {
      return BigInt(0);
    }
    if (typeof value === 'bigint') {
      return value;
    }
    if (typeof value === 'number') {
      return BigInt(Math.floor(value));
    }
    return BigInt(String(value));
  };
  
  const yesBigInt = toBigInt(yesVotes);
  const noBigInt = toBigInt(noVotes);
  
  const total = yesBigInt + noBigInt;
  
  if (total === BigInt(0)) {
    return { yesPercentage: 0, noPercentage: 0, totalVotes: BigInt(0) };
  }

  // Perform BigInt arithmetic: multiply by 100, then divide by total
  // All operands must be BigInt for the operations to work
  const oneHundred = BigInt(100);
  const yesPercentage = Number((yesBigInt * oneHundred) / total);
  const noPercentage = Number((noBigInt * oneHundred) / total);

  return { yesPercentage, noPercentage, totalVotes: total };
}

/**
 * Validate wallet address (EVM-compatible: Ethereum, Moonbeam, etc.)
 * Works for all EVM chains including Moonbase Alpha
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address) return false;
  // Trim whitespace and convert to lowercase for validation
  const trimmed = address.trim();
  // Must start with 0x and have exactly 40 hex characters
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
}

/**
 * Validate wallet address (EVM-compatible: Ethereum, Moonbeam, etc.)
 * Returns true if valid, false otherwise
 * Works for all EVM chains including Moonbase Alpha
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
 * Validate native currency amount (DEV on Moonbase Alpha)
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

/**
 * Decode Solidity revert reason from transaction error
 * Attempts to extract the actual error message from various error formats
 * Handles empty revert data ("0x") by providing diagnostic information
 */
export function decodeRevertReason(error: any): string | null {
  if (!error) return null;

  // Reject generic field names that aren't actual revert reasons
  const genericFields = ['code', 'message', 'name', 'stack', 'cause'];
  
  // Check for empty revert data FIRST - this often means a modifier or require failed
  // without a message, or the error wasn't properly encoded
  // Empty revert data ("0x") is the most common case and should be handled immediately
  const hasEmptyRevertData = error.data === '0x' || 
                            error.data === '' || 
                            (typeof error.data === 'string' && error.data.trim() === '0x') ||
                            (typeof error.data === 'object' && error.data && error.data.toString === '0x');
  
  if (hasEmptyRevertData) {
    // Empty revert data usually means one of:
    // 1. A modifier failed (like onlyAdmin) - MOST COMMON
    // 2. A require failed without a custom message
    // 3. The transaction was reverted for security reasons
    
    // Check the error message to confirm it's an execution revert
    const errorMessage = error?.message || error?.shortMessage || '';
    const errorStr = JSON.stringify(error || {}).toLowerCase();
    
    // If this is an execution reverted error, provide immediate diagnostic
    if (errorMessage.includes('Execution Reverted') || 
        errorMessage.includes('execution reverted') ||
        errorMessage.includes('revert') ||
        errorStr.includes('execution reverted')) {
      
      // For createProposal function, the most likely cause is admin check
      if (errorStr.includes('createproposal') || errorStr.includes('create_proposal')) {
        return "Admin only: Only the contract admin can create proposals. Verify your connected wallet address matches the contract's admin address exactly (case-insensitive).";
      }
      
      // Generic message for empty revert data with execution reverted
      return "Execution reverted (empty data): Transaction rejected by contract. Most likely causes: (1) Not the contract admin (check admin address matches your wallet), (2) Insufficient funds sent (verify msg.value matches escrow amount), (3) Invalid parameters (check all input fields).";
    }
    
    // Even if message doesn't explicitly say "revert", if data is empty and it's a transaction error, it's likely a revert
    if (error?.name === 'TransactionError' || errorStr.includes('transaction')) {
      return "Transaction reverted: Contract rejected the transaction. Most common cause: Not the contract admin. Verify your wallet address matches the contract's admin address.";
    }
    
    // Return null to continue checking other error formats
    // But we've already provided helpful diagnostics above
  }

  // Try to extract from error.data (common format)
  if (error.data) {
    // If data is a string starting with 0x, try to decode it
    if (typeof error.data === 'string' && error.data.startsWith('0x') && error.data.length > 2) {
      // Solidity errors are encoded with function selector + ABI-encoded string
      // Error(string) selector is: 0x08c379a0
      if (error.data.startsWith('0x08c379a0')) {
        try {
          // Extract the string from the encoded data (skip 4 bytes for selector, then decode)
          const hexData = error.data.slice(10); // Remove 0x08c379a0
          if (hexData.length >= 128) {
            // The first 64 chars are offset, next 64 are length, then the string
            const offset = parseInt(hexData.slice(0, 64), 16);
            const length = parseInt(hexData.slice(64, 128), 16);
            if (length > 0 && hexData.length >= 128 + length * 2) {
              const stringHex = hexData.slice(128, 128 + length * 2);
              // Convert hex to string
              const decoded = Buffer.from(stringHex, 'hex').toString('utf-8');
              return decoded;
            }
          }
        } catch (e) {
          // If decoding fails, continue to other methods
        }
      }
      
      // Try to decode other error selectors
      // Panic(uint256) selector is: 0x4e487b71
      if (error.data.startsWith('0x4e487b71')) {
        try {
          const hexData = error.data.slice(10);
          if (hexData.length >= 64) {
            const panicCode = parseInt(hexData.slice(0, 64), 16);
            const panicMessages: Record<number, string> = {
              0x01: 'Assertion failed',
              0x11: 'Arithmetic underflow/overflow',
              0x12: 'Division or modulo by zero',
              0x21: 'Conversion to enum out of bounds',
              0x22: 'Access to incorrect storage byte array',
              0x31: 'Pop on empty array',
              0x32: 'Array index out of bounds',
              0x41: 'Out of memory',
              0x51: 'Call to zero-initialized variable',
            };
            return panicMessages[panicCode] || `Panic error: 0x${panicCode.toString(16)}`;
          }
        } catch (e) {
          // Continue to other methods
        }
      }
    }
    
    // If data is an object, check for message property
    if (typeof error.data === 'object' && error.data.message) {
      return error.data.message;
    }
  }

  // Try nested error objects FIRST (often contains more detailed information)
  if (error.error) {
    const nestedReason = decodeRevertReason(error.error);
    if (nestedReason && !genericFields.includes(nestedReason.toLowerCase())) {
      return nestedReason;
    }
  }
  
  // Try error.reason (common in ethers.js)
  if (error.reason && typeof error.reason === 'string' && error.reason.length > 0) {
    const reason = error.reason.trim();
    if (reason && !genericFields.includes(reason.toLowerCase()) && reason.length > 2) {
      return reason;
    }
  }

  // Try error.shortMessage (ethers v6 format) - often contains the actual revert reason
  if (error.shortMessage && typeof error.shortMessage === 'string') {
    const shortMsg = error.shortMessage.trim();
    // Check if it's not just a generic message
    if (shortMsg && shortMsg.length > 10 && !shortMsg.includes('TransactionError')) {
      // Extract revert reason from short message if it contains one
      const revertMatch = shortMsg.match(/reverted.*?:\s*(.+)/i);
      if (revertMatch) {
        return revertMatch[1].trim();
      }
      // If it looks like a meaningful error message, return it
      if (!genericFields.includes(shortMsg.toLowerCase().substring(0, 20))) {
        return shortMsg;
      }
    }
  }

  // Try error.message
  if (error.message && typeof error.message === 'string') {
    const message = error.message;
    
    // Check if message contains a revert reason in quotes
    const quotedMatch = message.match(/"([^"]+)"/);
    if (quotedMatch && quotedMatch[1]) {
      const quoted = quotedMatch[1].trim();
      if (quoted && !genericFields.includes(quoted.toLowerCase()) && quoted.length > 2) {
        return quoted;
      }
    }
    
    // Check for common revert patterns with meaningful content
    const revertMatch = message.match(/revert(?:ed)?\s+(.+?)(?:$|[\n\.])/i);
    if (revertMatch && revertMatch[1]) {
      const revertReason = revertMatch[1].trim();
      if (revertReason && !genericFields.includes(revertReason.toLowerCase()) && revertReason.length > 2) {
        return revertReason;
      }
    }
    
    // Check for "VM Exception" format
    const vmMatch = message.match(/VM Exception[^:]*:\s*(.+)/i);
    if (vmMatch && vmMatch[1]) {
      const vmReason = vmMatch[1].trim();
      if (vmReason && !genericFields.includes(vmReason.toLowerCase()) && vmReason.length > 2) {
        return vmReason;
      }
    }
    
    // Look for execution reverted with details
    const execRevertMatch = message.match(/execution reverted[:\s]+(.+)/i);
    if (execRevertMatch && execRevertMatch[1]) {
      const execReason = execRevertMatch[1].trim();
      if (execReason && !genericFields.includes(execReason.toLowerCase()) && execReason.length > 2) {
        return execReason;
      }
    }
  }

  // Try to find revert reason in the full error object by checking all string properties
  // This is a fallback for unusual error structures
  const errorKeys = Object.keys(error);
  for (const key of errorKeys) {
    if (key === 'data' || key === 'code' || key === 'name' || key === 'stack') continue;
    const value = error[key];
    if (typeof value === 'string' && value.length > 10) {
      // Check if it looks like a revert reason
      if (value.toLowerCase().includes('revert') || 
          value.toLowerCase().includes('admin') ||
          value.toLowerCase().includes('insufficient') ||
          value.toLowerCase().includes('invalid')) {
        const extracted = value.match(/revert(?:ed)?[:\s]+(.+)/i);
        if (extracted && extracted[1]) {
          const reason = extracted[1].trim();
          if (reason && !genericFields.includes(reason.toLowerCase()) && reason.length > 2) {
            return reason;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Get user-friendly error message from transaction error
 * Combines revert reason decoding with common error patterns
 */
export function getTransactionErrorMessage(error: any, context?: {
  fundsAmount?: string;
  contractAddress?: string;
  userAddress?: string;
}): string {
  // First, try to decode the actual revert reason
  const revertReason = decodeRevertReason(error);
  
  if (revertReason && revertReason.trim().length > 0) {
    // Filter out generic/non-meaningful reasons
    const reasonLower = revertReason.toLowerCase().trim();
    
    // Skip if it's just a generic field name
    if (['code', 'message', 'name', 'stack'].includes(reasonLower) || reasonLower.length < 3) {
      // Fall through to diagnostic message below
    } else {
      // Map common revert reasons to user-friendly messages
      if (reasonLower.includes('admin only') || (reasonLower.includes('admin') && reasonLower.length > 5)) {
        return `❌ Admin Only: Only the contract admin can perform this action.\n\n` +
               `Your Address: ${context?.userAddress || 'Not connected'}\n` +
               `Please connect with the admin wallet.`;
      }
      
      if (reasonLower.includes('insufficient funds sent') || 
          (reasonLower.includes('insufficient') && reasonLower.includes('fund'))) {
        return `❌ Insufficient Funds: The transaction did not send enough DEV tokens.\n\n` +
               `Required: ${context?.fundsAmount || 'N/A'} DEV\n` +
               `Make sure MetaMask shows the correct amount when confirming.`;
      }
      
      if (reasonLower.includes('invalid contractor address') || 
          (reasonLower.includes('invalid') && reasonLower.includes('address'))) {
        return `❌ Invalid Address: The contractor address is invalid.\n\n` +
               `Please check the address format (must start with 0x and be 42 characters).`;
      }
      
      if (reasonLower.includes('description cannot be empty')) {
        return `❌ Empty Description: The proposal description cannot be empty.`;
      }
      
      // Return the decoded reason if we couldn't map it (and it's meaningful)
      if (reasonLower.length > 10 && !reasonLower.includes('transactionerror')) {
        return `❌ Contract Error: ${revertReason}`;
      }
    }
  }

  // Fallback: Check for common error patterns in the full error structure
  const errorStr = JSON.stringify(error || '').toLowerCase();
  
  if (errorStr.includes('user rejected') || errorStr.includes('denied') || errorStr.includes('user rejected')) {
    return '⚠️ Transaction Rejected: You cancelled the transaction in MetaMask.';
  }
  
  if (errorStr.includes('network') || errorStr.includes('chain') || errorStr.includes('wrong network')) {
    return '❌ Network Error: Please switch to Moonbase Alpha testnet (Chain ID: 1287).';
  }
  
  // Check if error.data is empty - this usually means a modifier or require failed
  if (error?.data === '0x' || error?.data === '' || (typeof error?.data === 'string' && error?.data.trim() === '0x')) {
    return '❌ Transaction Reverted (Empty Revert Data)\n\n' +
           'The contract rejected the transaction. Common causes:\n' +
           '1. Not the contract admin (most common)\n' +
           '2. Insufficient funds sent\n' +
           '3. Invalid parameters\n' +
           '4. Contract state mismatch\n\n' +
           'Check the browser console for detailed diagnostics.';
  }
  
  // Check error message for execution reverted
  const errorMessage = error?.message || error?.shortMessage || '';
  if (errorMessage && typeof errorMessage === 'string') {
    if (errorMessage.toLowerCase().includes('execution reverted')) {
      return '❌ Execution Reverted\n\n' +
             'The transaction was rejected by the contract. Possible causes:\n' +
             '1. Not the contract admin\n' +
             '2. Insufficient funds sent\n' +
             '3. Invalid parameters\n\n' +
             'Check the browser console for detailed error information.';
    }
  }
  
  return '❌ Transaction Failed: Please check the console for details.';
}
