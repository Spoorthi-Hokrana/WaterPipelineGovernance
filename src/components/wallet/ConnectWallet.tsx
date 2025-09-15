"use client";

import { ConnectButton } from "thirdweb/react";
import { client, DEFAULT_CHAIN } from "@/lib/thirdweb";
import { createWallet } from "thirdweb/wallets";

// Define supported wallets
const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("app.phantom"),
];

interface ConnectWalletProps {
  className?: string;
}

export function ConnectWallet({ className = "" }: ConnectWalletProps) {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chains={[DEFAULT_CHAIN]}
      connectModal={{
        size: "compact",
        title: "Connect to Water Pipeline Governance",
        showThirdwebBranding: false,
      }}
      theme="auto"
      className={`min-w-[200px] h-12 ${className}`}
    />
  );
}
