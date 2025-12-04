"use client";

import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";
import { CONTRACT_ADDRESS } from "@/lib/contract/config";

/**
 * Diagnostic component to help troubleshoot admin access issues
 */
export function AdminDiagnostics() {
  const account = useActiveAccount();
  const { admin, adminLoading } = useGovernanceContract();

  const diagnostics = useMemo(() => {
    if (!account?.address || !admin || adminLoading) {
      return {
        isAdmin: false,
        yourAddress: account?.address || "Not connected",
        adminAddress: admin ? (admin as string) : "Loading...",
        addressesMatch: false,
        message: "Loading admin status...",
      };
    }

    const yourAddr = account.address.toLowerCase();
    const adminAddr = (admin as string).toLowerCase();
    const matches = yourAddr === adminAddr;

    return {
      isAdmin: matches,
      yourAddress: account.address,
      adminAddress: admin as string,
      addressesMatch: matches,
      message: matches
        ? "✅ You ARE the admin!"
        : "❌ You are NOT the admin. Addresses don't match.",
    };
  }, [account?.address, admin, adminLoading]);

  if (adminLoading) {
    return (
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">⏳ Loading admin status...</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 border-2 rounded-lg ${
        diagnostics.isAdmin
          ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600"
          : "bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600"
      }`}
    >
      <h3 className="font-bold text-lg mb-3">🔍 Admin Status Diagnostics</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong className="block mb-1">Your Wallet Address:</strong>
          <div className="font-mono text-xs break-all bg-white dark:bg-gray-800 p-2 rounded">
            {diagnostics.yourAddress}
          </div>
        </div>

        <div>
          <strong className="block mb-1">Contract Admin Address:</strong>
          <div className="font-mono text-xs break-all bg-white dark:bg-gray-800 p-2 rounded">
            {diagnostics.adminAddress}
          </div>
        </div>

        <div className="mt-4">
          <strong className="block mb-1">Status:</strong>
          <div
            className={`px-3 py-2 rounded font-bold ${
              diagnostics.isAdmin
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {diagnostics.message}
          </div>
        </div>

        {!diagnostics.isAdmin && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
            <p className="font-semibold mb-2">💡 How to Fix:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>
                Switch to the wallet that deployed the contract:{" "}
                <span className="font-mono">{diagnostics.adminAddress}</span>
              </li>
              <li>
                Or ask the current admin to transfer admin rights to your address:{" "}
                <span className="font-mono">{diagnostics.yourAddress}</span>
              </li>
              <li>
                Or deploy a new contract where your wallet is the admin
              </li>
            </ol>
            <div className="mt-3">
              <a
                href={`https://moonbase.moonscan.io/address/${CONTRACT_ADDRESS}#readContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                🔗 Verify admin on Moonscan →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


