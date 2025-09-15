"use client";

import { useActiveAccount } from "thirdweb/react";
import { VoterRegistration } from "@/components/governance/VoterRegistration";
import { ProposalCreation } from "@/components/governance/ProposalCreation";
import { ProposalFinalization } from "@/components/governance/ProposalFinalization";
import { MilestoneManagement } from "@/components/governance/MilestoneManagement";

export default function GovernancePage() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Wallet Connection Required
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Please connect your wallet to access governance functions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">⚙️</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Governance Panel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create proposals, register voters, and manage the decentralized governance system
          </p>
        </div>

        {/* Governance Functions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Voter Registration */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <VoterRegistration />
          </div>

          {/* Proposal Creation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <ProposalCreation />
          </div>

          {/* Proposal Finalization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <ProposalFinalization />
          </div>

          {/* Milestone Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <MilestoneManagement />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
            🏛️ Decentralized Governance
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            Anyone with a connected wallet can participate in governance. Register as a voter, 
            create proposals, vote on decisions, and manage milestones. This is a fully 
            decentralized system where the community has complete control.
          </p>
        </div>
      </div>
    </div>
  );
}
