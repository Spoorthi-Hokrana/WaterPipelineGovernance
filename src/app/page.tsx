"use client";

import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { useGovernanceContract, ProposalStatus } from "@/hooks/contract";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { QuickTest } from "@/components/testing/QuickTest";

export default function Home() {
  const account = useActiveAccount();
  const { proposalCount, getProposal, isAdmin } = useGovernanceContract();

  // Get some basic stats
  const totalProposals = Number(proposalCount) || 0;
  const activeProposals = Array.from({ length: totalProposals }, (_, i) => i + 1)
    .map(id => getProposal(id).proposal)
    .filter(p => p && p.status === ProposalStatus.Active).length;

  // Everyone has access to governance in this decentralized system

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">💧</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Water Pipeline
            <span className="text-blue-600 dark:text-blue-400"> Governance</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Participate in decentralized governance for water pipeline management. 
            Vote on proposals, track milestones, and ensure transparent resource allocation.
          </p>
          
          {!account ? (
            <div className="max-w-md mx-auto">
              <ConnectWallet className="w-full mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your wallet to get started with governance participation
              </p>
            </div>
          ) : (
            <WalletStatus />
          )}
        </div>

        {/* Quick Stats */}
        {account && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProposals}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Total Proposals</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-2">🔵</div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeProposals}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Active Voting</p>
            </div>
            
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="text-3xl mb-2">🏛️</div>
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    Everyone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Can Participate</p>
                </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                Active
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Platform Status</p>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link
            href="/proposals"
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              View Proposals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Browse all governance proposals and their current status
            </p>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
              Explore →
            </span>
          </Link>

          <Link
            href="/voting"
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Cast Votes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Participate in active voting with your weighted vote
            </p>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
              Vote Now →
            </span>
          </Link>

          <Link
            href="/milestones"
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Track Milestones
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Monitor project progress and milestone completion
            </p>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
              Track →
            </span>
          </Link>

              <Link
                href="/governance"
                className="bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Governance
                </h3>
                <p className="text-purple-700 dark:text-purple-200 mb-4">
                  Create proposals, register voters, and manage milestones
                </p>
                <span className="text-purple-600 dark:text-purple-400 group-hover:underline">
                  Participate →
                </span>
              </Link>
        </div>

            {/* Testing Section - Development Only */}
            {process.env.NODE_ENV === 'development' && account && (
              <div className="mb-16">
                <QuickTest />
              </div>
            )}

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Decentralized Governance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Democratic decision-making process with weighted voting based on stakeholder roles
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Blockchain Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All votes and decisions recorded immutably on the blockchain for full transparency
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Milestone-Based Funding
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatic fund release based on verified milestone completion and progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
