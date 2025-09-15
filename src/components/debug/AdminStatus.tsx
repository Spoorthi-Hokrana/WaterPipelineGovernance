"use client";

import { useActiveAccount } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";

export function AdminStatus() {
  const account = useActiveAccount();
  const { admin, isAdmin, adminLoading } = useGovernanceContract();

  if (!account) {
    return (
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 m-4">
        <h3 className="font-bold text-yellow-800">👔 Admin Status Check</h3>
        <p className="text-yellow-700">Please connect your wallet to check admin status.</p>
      </div>
    );
  }

  const userIsAdmin = isAdmin(account.address);

  return (
    <div className={`border rounded-lg p-4 m-4 ${userIsAdmin ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
      <h3 className="font-bold mb-2">👔 Admin Status Check</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Your Address:</strong>
          <div className="font-mono text-xs break-all">{account.address}</div>
        </div>
        
        <div>
          <strong>Contract Admin:</strong>
          <div className="font-mono text-xs break-all">
            {adminLoading ? "Loading..." : admin || "Not loaded"}
          </div>
        </div>
        
        <div>
          <strong>Your Admin Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
            userIsAdmin 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {userIsAdmin ? "✅ ADMIN ACCESS GRANTED" : "❌ NO ADMIN ACCESS"}
          </span>
        </div>

        {account.address.toLowerCase() === "0xcbF77a3F7204B3179ea8DE382C7C9Ff7E19081d8".toLowerCase() && (
          <div className="mt-2 p-2 bg-purple-100 border border-purple-300 rounded">
            <span className="text-purple-700 font-bold">🔧 Force Admin Override Active</span>
            <p className="text-purple-600 text-xs">Your wallet has been granted admin access via frontend override.</p>
          </div>
        )}
      </div>
    </div>
  );
}
