# Smart Contract Integration Guide

This document provides a comprehensive guide to the WaterPipelineGovernance smart contract integration with the Next.js frontend.

## 📋 Overview

The frontend is fully integrated with the WaterPipelineGovernance smart contract using thirdweb v5 hooks and custom React hooks for all contract functions.

## 🏗️ Project Structure

```
src/
├── hooks/contract/                 # Contract interaction hooks
│   ├── index.ts                   # Centralized exports
│   ├── useGovernanceContract.ts   # Read contract data
│   ├── useVoterActions.ts         # Voter registration & voting
│   ├── useProposalActions.ts      # Proposal creation & finalization
│   └── useMilestoneActions.ts     # Milestone management
├── lib/contract/                  # Contract configuration
│   ├── abi.ts                     # Contract ABI
│   └── config.ts                  # Contract setup & types
├── utils/
│   └── contractUtils.ts           # Utility functions
└── components/contract/
    └── ContractInteractionExample.tsx  # Example implementation
```

## 🔧 Configuration

### Environment Variables

Add to your `.env.local` file:

```env
# Required
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id

# Optional (add after contract deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Optional
NEXT_PUBLIC_APP_NAME="Water Pipeline Governance"
NEXT_PUBLIC_DEFAULT_CHAIN_ID=11155111  # Sepolia testnet
```

### Contract Configuration

Update the contract address in `src/lib/contract/config.ts` after deployment:

```typescript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

## 🪝 Available Hooks

### 1. useGovernanceContract - Read Contract Data

```typescript
import { useGovernanceContract } from "@/hooks/contract";

function MyComponent() {
  const { 
    admin,                    // Contract admin address
    proposalCount,           // Total number of proposals
    getProposal,            // Function to get proposal by ID
    getVoter,               // Function to get voter by address
    isAdmin                 // Check if address is admin
  } = useGovernanceContract();

  // Get specific proposal
  const { proposal, isLoading } = getProposal(1);
  
  // Get voter info
  const { voter } = getVoter("0x...");
  
  return (
    <div>
      <p>Admin: {admin}</p>
      <p>Total Proposals: {proposalCount?.toString()}</p>
    </div>
  );
}
```

### 2. useVoterActions - Voter Management

```typescript
import { useVoterActions, VoterType } from "@/hooks/contract";

function VoterManagement() {
  const { registerVoter, vote, isPending } = useVoterActions();

  const handleRegisterVoter = async () => {
    await registerVoter(
      "0x1234...",           // Voter address
      VoterType.Municipal,   // Voter type (Municipal=1, Engineer=2, Citizen=3)
      100                    // Voting weight
    );
  };

  const handleVote = async () => {
    await vote(
      1,        // Proposal ID
      true      // Support (true = yes, false = no)
    );
  };

  return (
    <div>
      <button onClick={handleRegisterVoter} disabled={isPending}>
        Register Voter
      </button>
      <button onClick={handleVote} disabled={isPending}>
        Cast Vote
      </button>
    </div>
  );
}
```

### 3. useProposalActions - Proposal Management

```typescript
import { useProposalActions } from "@/hooks/contract";

function ProposalManagement() {
  const { createProposal, finalizeProposal, isPending } = useProposalActions();

  const handleCreateProposal = async () => {
    await createProposal(
      "Fix water leak on Main Street",    // Description
      "0x5678...",                        // Contractor address
      "5.0"                              // Funds escrowed (ETH)
    );
  };

  const handleFinalizeProposal = async () => {
    await finalizeProposal(1);  // Proposal ID
  };

  return (
    <div>
      <button onClick={handleCreateProposal} disabled={isPending}>
        Create Proposal
      </button>
      <button onClick={handleFinalizeProposal} disabled={isPending}>
        Finalize Proposal
      </button>
    </div>
  );
}
```

### 4. useMilestoneActions - Milestone Management

```typescript
import { useMilestoneActions } from "@/hooks/contract";

function MilestoneManagement() {
  const { addMilestone, completeMilestone, isPending } = useMilestoneActions();

  const handleAddMilestone = async () => {
    await addMilestone(
      1,                              // Proposal ID
      "Complete excavation work",     // Milestone description
      new Date("2024-12-31"),        // Target date
      "1.5"                          // Release amount (ETH)
    );
  };

  const handleCompleteMilestone = async () => {
    await completeMilestone(
      1,  // Proposal ID
      1   // Milestone ID
    );
  };

  return (
    <div>
      <button onClick={handleAddMilestone} disabled={isPending}>
        Add Milestone
      </button>
      <button onClick={handleCompleteMilestone} disabled={isPending}>
        Complete Milestone
      </button>
    </div>
  );
}
```

## 🛠️ Utility Functions

### Contract Data Formatting

```typescript
import { 
  weiToEth, 
  ethToWei, 
  formatTimestamp, 
  getTimeRemaining,
  getVotingProgress 
} from "@/utils/contractUtils";

// Convert Wei to ETH
const ethAmount = weiToEth(BigInt("1000000000000000000")); // "1.0"

// Convert ETH to Wei
const weiAmount = ethToWei("1.5"); // 1500000000000000000n

// Format timestamps
const readableDate = formatTimestamp(BigInt(1699123456)); // "Nov 4, 2023, 5:24:16 PM"

// Get time remaining
const timeLeft = getTimeRemaining(BigInt(1699123456)); // "2d 5h remaining"

// Calculate voting progress
const { yesPercentage, noPercentage } = getVotingProgress(
  BigInt(150), // Yes votes
  BigInt(50)   // No votes
); // { yesPercentage: 75, noPercentage: 25 }
```

### Validation Functions

```typescript
import { 
  validateEthereumAddress,
  validateProposalDescription,
  validateEthAmount 
} from "@/utils/contractUtils";

// Validate addresses
const isValid = validateEthereumAddress("0x1234..."); // boolean

// Validate proposal descriptions
const descValidation = validateProposalDescription("Short");
// { isValid: false, error: "Description must be at least 10 characters" }

// Validate ETH amounts
const amountValidation = validateEthAmount("1.5");
// { isValid: true }
```

## 📊 Contract Types & Enums

### ProposalStatus

```typescript
enum ProposalStatus {
  Pending = 0,
  Active = 1,
  Passed = 2,
  Failed = 3,
  Executed = 4
}
```

### VoterType

```typescript
enum VoterType {
  Municipal = 1,  // Municipal officials
  Engineer = 2,   // Engineers/technical experts
  Citizen = 3     // Citizens/stakeholders
}
```

### TypeScript Interfaces

```typescript
interface Proposal {
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

interface Voter {
  exists: boolean;
  voterType: VoterType;
  weight: bigint;
}

interface Milestone {
  description: string;
  targetDate: bigint;
  completed: boolean;
  releaseAmount: bigint;
}
```

## 🎯 Example Implementation

See `src/components/contract/ContractInteractionExample.tsx` for a complete working example that demonstrates:

- Admin functions (register voters, create proposals, add milestones)
- Voting functionality for registered voters
- Proposal finalization
- Real-time contract data display
- Form validation and error handling

## 🚀 Deployment Checklist

1. **Deploy the smart contract** to your chosen network
2. **Update environment variables** with:
   - Thirdweb Client ID
   - Deployed contract address
3. **Test all functions** with the example component
4. **Implement your custom UI** using the provided hooks
5. **Add error handling** and loading states for better UX

## 🔒 Security Considerations

- All admin functions require the caller to be the contract admin
- Voter registration must be done by admin to prevent unauthorized voting
- Proposals have a 7-day voting period that cannot be bypassed
- Milestone completion triggers fund release (implement carefully)

## 📚 Next Steps

1. Build custom UI components using the provided hooks
2. Add event listening for real-time updates
3. Implement proposal listing and filtering
4. Add milestone tracking and progress visualization
5. Create admin dashboard for contract management

This integration provides a complete foundation for interacting with the WaterPipelineGovernance smart contract from your React frontend.
