"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import {
  useGovernanceContract,
  useVoterActions,
  useProposalActions,
  useMilestoneActions,
  VoterType,
  getVoterTypeText,
  getProposalStatusText,
} from "@/hooks/contract";
import { weiToEth, validateEthereumAddress, validateProposalDescription, validateEthAmount } from "@/utils/contractUtils";

/**
 * Example component demonstrating all contract interactions
 * This serves as a reference for implementing actual UI components
 */
export function ContractInteractionExample() {
  const account = useActiveAccount();
  const { admin, proposalCount, getVoter, getProposal, isAdmin } = useGovernanceContract();
  const { registerVoter, vote, isPending: voterPending } = useVoterActions();
  const { createProposal, finalizeProposal, isPending: proposalPending } = useProposalActions();
  const { addMilestone, completeMilestone, isPending: milestonePending } = useMilestoneActions();

  // Form states
  const [voterAddress, setVoterAddress] = useState("");
  const [voterType, setVoterType] = useState<VoterType>(VoterType.Citizen);
  const [voterWeight, setVoterWeight] = useState("1");
  
  const [proposalDescription, setProposalDescription] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [fundsAmount, setFundsAmount] = useState("");
  
  const [voteProposalId, setVoteProposalId] = useState("");
  const [voteSupport, setVoteSupport] = useState(true);
  
  const [milestoneProposalId, setMilestoneProposalId] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");

  const handleRegisterVoter = async () => {
    try {
      if (!validateEthereumAddress(voterAddress)) {
        alert("Invalid voter address");
        return;
      }
      
      await registerVoter(voterAddress, voterType, parseInt(voterWeight));
      alert("Voter registered successfully!");
      setVoterAddress("");
      setVoterWeight("1");
    } catch (error) {
      console.error(error);
      alert("Failed to register voter");
    }
  };

  const handleCreateProposal = async () => {
    try {
      const descValidation = validateProposalDescription(proposalDescription);
      if (!descValidation.isValid) {
        alert(descValidation.error);
        return;
      }
      
      if (!validateEthereumAddress(contractorAddress)) {
        alert("Invalid contractor address");
        return;
      }
      
      const amountValidation = validateEthAmount(fundsAmount);
      if (!amountValidation.isValid) {
        alert(amountValidation.error);
        return;
      }
      
      await createProposal(proposalDescription, contractorAddress, fundsAmount);
      alert("Proposal created successfully!");
      setProposalDescription("");
      setContractorAddress("");
      setFundsAmount("");
    } catch (error) {
      console.error(error);
      alert("Failed to create proposal");
    }
  };

  const handleVote = async () => {
    try {
      const proposalId = parseInt(voteProposalId);
      if (isNaN(proposalId) || proposalId < 1) {
        alert("Invalid proposal ID");
        return;
      }
      
      await vote(proposalId, voteSupport);
      alert("Vote cast successfully!");
      setVoteProposalId("");
    } catch (error) {
      console.error(error);
      alert("Failed to cast vote");
    }
  };

  const handleFinalizeProposal = async () => {
    try {
      const proposalId = parseInt(voteProposalId);
      if (isNaN(proposalId) || proposalId < 1) {
        alert("Invalid proposal ID");
        return;
      }
      
      await finalizeProposal(proposalId);
      alert("Proposal finalized successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to finalize proposal");
    }
  };

  const handleAddMilestone = async () => {
    try {
      const proposalId = parseInt(milestoneProposalId);
      if (isNaN(proposalId) || proposalId < 1) {
        alert("Invalid proposal ID");
        return;
      }
      
      if (!milestoneDescription.trim()) {
        alert("Milestone description is required");
        return;
      }
      
      const amountValidation = validateEthAmount(milestoneAmount);
      if (!amountValidation.isValid) {
        alert(amountValidation.error);
        return;
      }
      
      const targetDate = new Date(milestoneDate);
      if (isNaN(targetDate.getTime())) {
        alert("Invalid milestone date");
        return;
      }
      
      await addMilestone(proposalId, milestoneDescription, targetDate, milestoneAmount);
      alert("Milestone added successfully!");
      setMilestoneDescription("");
      setMilestoneAmount("");
      setMilestoneDate("");
    } catch (error) {
      console.error(error);
      alert("Failed to add milestone");
    }
  };

  // Get current user voter info
  const { voter: currentVoter } = getVoter(account?.address || "");
  
  // Get latest proposal
  const { proposal: latestProposal } = getProposal(Number(proposalCount) || 1);

  if (!account) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to interact with the contract.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Contract Interaction Dashboard
      </h2>

      {/* Contract Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Contract Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Admin:</span>
            <p className="font-mono">{admin || "Loading..."}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total Proposals:</span>
            <p>{proposalCount?.toString() || "0"}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">You are Admin:</span>
            <p>{isAdmin(account.address) ? "Yes" : "No"}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Your Voter Status:</span>
            <p>{currentVoter?.exists ? getVoterTypeText(currentVoter.voterType) : "Not registered"}</p>
          </div>
        </div>
      </div>

      {/* Admin Only Section */}
      {isAdmin(account.address) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
            Admin Functions
          </h3>

          {/* Register Voter */}
          <div className="space-y-4 mb-6">
            <h4 className="font-medium">Register Voter</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Voter Address"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={voterType}
                onChange={(e) => setVoterType(parseInt(e.target.value) as VoterType)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={VoterType.Municipal}>Municipal</option>
                <option value={VoterType.Engineer}>Engineer</option>
                <option value={VoterType.Citizen}>Citizen</option>
              </select>
              <input
                type="number"
                placeholder="Weight"
                value={voterWeight}
                onChange={(e) => setVoterWeight(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleRegisterVoter}
                disabled={voterPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {voterPending ? "Registering..." : "Register"}
              </button>
            </div>
          </div>

          {/* Create Proposal */}
          <div className="space-y-4">
            <h4 className="font-medium">Create Proposal</h4>
            <div className="space-y-3">
              <textarea
                placeholder="Proposal Description"
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Contractor Address"
                  value={contractorAddress}
                  onChange={(e) => setContractorAddress(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Funds Amount (ETH)"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleCreateProposal}
                  disabled={proposalPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {proposalPending ? "Creating..." : "Create Proposal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Section */}
      {currentVoter?.exists && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-4 text-green-900 dark:text-green-100">
            Voting Functions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Proposal ID"
              value={voteProposalId}
              onChange={(e) => setVoteProposalId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={voteSupport ? "yes" : "no"}
              onChange={(e) => setVoteSupport(e.target.value === "yes")}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="yes">Vote Yes</option>
              <option value="no">Vote No</option>
            </select>
            <button
              onClick={handleVote}
              disabled={voterPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {voterPending ? "Voting..." : "Cast Vote"}
            </button>
            {isAdmin(account.address) && (
              <button
                onClick={handleFinalizeProposal}
                disabled={proposalPending}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {proposalPending ? "Finalizing..." : "Finalize"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Latest Proposal Info */}
      {latestProposal && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Latest Proposal</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">ID:</span> {latestProposal.id.toString()}</p>
            <p><span className="font-medium">Description:</span> {latestProposal.description}</p>
            <p><span className="font-medium">Status:</span> {getProposalStatusText(latestProposal.status)}</p>
            <p><span className="font-medium">Yes Votes:</span> {latestProposal.yesVotes.toString()}</p>
            <p><span className="font-medium">No Votes:</span> {latestProposal.noVotes.toString()}</p>
            <p><span className="font-medium">Funds Escrowed:</span> {weiToEth(latestProposal.fundsEscrowed)} ETH</p>
          </div>
        </div>
      )}

      {/* Add Milestone (Admin only) */}
      {isAdmin(account.address) && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100">
            Milestone Management
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Proposal ID"
                value={milestoneProposalId}
                onChange={(e) => setMilestoneProposalId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Release Amount (ETH)"
                value={milestoneAmount}
                onChange={(e) => setMilestoneAmount(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <textarea
              placeholder="Milestone Description"
              value={milestoneDescription}
              onChange={(e) => setMilestoneDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleAddMilestone}
                disabled={milestonePending}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {milestonePending ? "Adding..." : "Add Milestone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
