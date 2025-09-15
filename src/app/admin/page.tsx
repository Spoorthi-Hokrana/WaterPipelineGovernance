"use client";

import { useActiveAccount } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";
import { VoterRegistration } from "@/components/admin/VoterRegistration";
import { ProposalCreation } from "@/components/admin/ProposalCreation";
import { ProposalFinalization } from "@/components/admin/ProposalFinalization";

export default function AdminPage() {
  const account = useActiveAccount();
  const { admin, isAdmin, proposalCount, adminLoading } = useGovernanceContract();

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Wallet Connection Required
            </h2>
            <p className="text-yellow-700">
              Please connect your wallet to access the admin panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin status...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin(account.address)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⛔</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Access Denied
            </h2>
            <p className="text-red-700 mb-4">
              You are not authorized to access the admin panel.
            </p>
            <div className="text-sm text-red-600 space-y-1">
              <p><strong>Your Address:</strong></p>
              <p className="font-mono break-all">{account.address}</p>
              <p><strong>Admin Address:</strong></p>
              <p className="font-mono break-all">{admin || "Loading..."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ⚙️ Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage voters, create proposals, and finalize voting results.
        </p>
        
        {/* Admin Info */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-100">Admin Address:</span>
              <p className="font-mono text-blue-700 dark:text-blue-300 break-all">{admin}</p>
            </div>
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-100">Total Proposals:</span>
              <p className="text-blue-700 dark:text-blue-300">{proposalCount?.toString() || "0"}</p>
            </div>
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-100">Status:</span>
              <p className="text-green-600 dark:text-green-400 font-medium">Admin Access Granted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Functions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <VoterRegistration />
          <ProposalFinalization />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ProposalCreation />
          
          {/* Quick Stats */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/proposals'}
                className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📋</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">View All Proposals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor proposal status and voting</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => window.location.href = '/milestones'}
                className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">🎯</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Manage Milestones</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add and complete project milestones</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
