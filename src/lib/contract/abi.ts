/**
 * WaterPipelineGovernance Contract ABI
 * Generated from the deployed Solidity contract
 */

export const WATER_PIPELINE_GOVERNANCE_ABI = [
  // Constructor
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  
  // State Variables
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proposalCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Mappings
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "proposals",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "creationTime", "type": "uint256"},
      {"internalType": "uint256", "name": "votingDeadline", "type": "uint256"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "uint256", "name": "yesVotes", "type": "uint256"},
      {"internalType": "uint256", "name": "noVotes", "type": "uint256"},
      {"internalType": "address", "name": "contractAddress", "type": "address"},
      {"internalType": "uint256", "name": "fundsEscrowed", "type": "uint256"},
      {"internalType": "uint256", "name": "milestoneCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "voters",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "uint8", "name": "voterType", "type": "uint8"},
      {"internalType": "uint256", "name": "weight", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Main Functions
  {
    "inputs": [
      {"internalType": "address", "name": "_voter", "type": "address"},
      {"internalType": "uint8", "name": "_type", "type": "uint8"},
      {"internalType": "uint256", "name": "_weight", "type": "uint256"}
    ],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_desc", "type": "string"},
      {"internalType": "address", "name": "_contractAddr", "type": "address"},
      {"internalType": "uint256", "name": "_fundsEscrowed", "type": "uint256"}
    ],
    "name": "createProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_proposalId", "type": "uint256"},
      {"internalType": "bool", "name": "support", "type": "bool"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_proposalId", "type": "uint256"}
    ],
    "name": "finalizeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_proposalId", "type": "uint256"},
      {"internalType": "string", "name": "_desc", "type": "string"},
      {"internalType": "uint256", "name": "_targetDate", "type": "uint256"},
      {"internalType": "uint256", "name": "_releaseAmount", "type": "uint256"}
    ],
    "name": "addMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_proposalId", "type": "uint256"},
      {"internalType": "uint256", "name": "_milestoneId", "type": "uint256"}
    ],
    "name": "completeMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "ProposalCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": false, "internalType": "bool", "name": "support", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "weight", "type": "uint256"}
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"}
    ],
    "name": "ProposalExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "milestoneId", "type": "uint256"}
    ],
    "name": "MilestoneCompleted",
    "type": "event"
  }
] as const;
