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
    <div className="card-premium max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-1">
          Wallet Connected
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm sm:text-base text-black/60 dark:text-white/60 font-medium">Address:</span>
          <span className="font-mono text-sm sm:text-base text-black dark:text-white font-semibold break-all sm:break-normal">
            {formatAddress(account.address)}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm sm:text-base text-black/60 dark:text-white/60 font-medium">Network:</span>
          <span className="text-sm sm:text-base text-black dark:text-white font-semibold">
            {chainInfo.name}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm sm:text-base text-black/60 dark:text-white/60 font-medium">Wallet:</span>
          <span className="text-sm sm:text-base text-black dark:text-white font-semibold capitalize">
            {wallet.id.replace(/[.-]/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}
