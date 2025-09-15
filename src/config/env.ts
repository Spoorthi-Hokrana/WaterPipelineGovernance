// Environment configuration for the application
export const ENV = {
  THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
  THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY || "",
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Water Pipeline Governance",
  DEFAULT_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "11155111"),
} as const;

// Validation function to check if required environment variables are set
export function validateEnv() {
  const requiredVars = ["THIRDWEB_CLIENT_ID"];
  const optionalVars = ["CONTRACT_ADDRESS"];
  
  const missingVars = requiredVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  const missingOptional = optionalVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(", ")}`);
    console.warn("Please create a .env.local file with the required variables");
  }
  
  if (missingOptional.length > 0) {
    console.info(`Optional environment variables not set: ${missingOptional.join(", ")}`);
    console.info("These can be added after contract deployment");
  }
  
  return missingVars.length === 0;
}
