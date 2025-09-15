import { createThirdwebClient } from "thirdweb";
import { ethereum, polygon, sepolia, polygonMumbai, defineChain } from "thirdweb/chains";

// Client ID from thirdweb dashboard
export const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here";

// Create thirdweb client
export const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

// Define Moonbeam testnet (Moonbase Alpha)
export const moonbaseAlpha = defineChain({
  id: 1287,
  name: "Moonbase Alpha",
  nativeCurrency: {
    name: "DEV",
    symbol: "DEV", 
    decimals: 18,
  },
  rpc: "https://rpc.api.moonbase.moonbeam.network",
  blockExplorers: [
    {
      name: "Moonscan",
      url: "https://moonbase.moonscan.io",
    },
  ],
  testnet: true,
});

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  ethereum,
  polygon,
  sepolia,
  polygonMumbai,
  moonbaseAlpha,
} as const;

// Default chain for the application - using Moonbeam testnet for testing
export const DEFAULT_CHAIN = moonbaseAlpha;

// Chain information helper
export function getChainInfo(chainId: number) {
  const chainMap = {
    [ethereum.id]: { name: "Ethereum", symbol: "ETH" },
    [polygon.id]: { name: "Polygon", symbol: "MATIC" },
    [sepolia.id]: { name: "Sepolia", symbol: "ETH" },
    [polygonMumbai.id]: { name: "Polygon Mumbai", symbol: "MATIC" },
    [moonbaseAlpha.id]: { name: "Moonbase Alpha", symbol: "DEV" },
  };

  return chainMap[chainId] || { name: "Unknown", symbol: "ETH" };
}
