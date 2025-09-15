"use client";

import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { formatAddress } from "@/utils/blockchain";
import { getChainInfo } from "@/lib/thirdweb";

export function WalletStatus() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  if (!account || !wallet) {
    return (
      <div className="text-sm text-gray-500 text-center">
        Connect your wallet to get started with Water Pipeline Governance
      </div>
    );
  }

  const chainInfo = getChainInfo(account.chainId || 1);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Wallet Connected
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Address:</span>
          <span className="font-mono text-gray-900 dark:text-white">
            {formatAddress(account.address)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Network:</span>
          <span className="text-gray-900 dark:text-white">
            {chainInfo.name}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Wallet:</span>
          <span className="text-gray-900 dark:text-white capitalize">
            {wallet.id.replace(/[.-]/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
