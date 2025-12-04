"use client";

import { useState, useEffect } from "react";
import { useProposalActions } from "@/hooks/contract";
import { validateEthereumAddress, validateProposalDescription, validateEthAmount, decodeRevertReason, getTransactionErrorMessage } from "@/utils/contractUtils";
import { CONTRACT_ADDRESS } from "@/lib/contract/config";
import { useActiveAccount } from "thirdweb/react";

export function ProposalCreation() {
  const { createProposal, isPending } = useProposalActions();
  const account = useActiveAccount();
  const [formData, setFormData] = useState({
    description: "",
    contractorAddress: "",
    fundsAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [contractWarning, setContractWarning] = useState("");

  // Check if using correct contract address
  useEffect(() => {
    const correctAddress = "0x71864A1CB9409879Fd8B51f4c5A0e09025beeC80".toLowerCase();
    const currentAddress = CONTRACT_ADDRESS.toLowerCase();
    
    if (currentAddress !== correctAddress && currentAddress !== "0x0000000000000000000000000000000000000000") {
      setContractWarning(`⚠️ Warning: Using contract ${CONTRACT_ADDRESS}. Expected: 0x71864A1CB9409879Fd8B51f4c5A0e09025beeC80. Restart dev server to fix.`);
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const descValidation = validateProposalDescription(formData.description);
    if (!descValidation.isValid) {
      newErrors.description = descValidation.error || "Invalid description";
    }

    // Trim the address before validation
    const trimmedAddress = formData.contractorAddress.trim();
    if (!trimmedAddress) {
      newErrors.contractorAddress = "Contractor address is required";
    } else if (!validateEthereumAddress(trimmedAddress)) {
      // Provide detailed error message
      const length = trimmedAddress.length;
      const startsWith0x = trimmedAddress.toLowerCase().startsWith("0x");
      const hexPattern = /^0x[a-fA-F0-9]+$/;
      const hasValidChars = hexPattern.test(trimmedAddress);
      
      let errorDetail = "";
      if (!startsWith0x) {
        errorDetail = "Address must start with '0x'";
      } else if (length !== 42) {
        errorDetail = `Address has ${length} characters. It must have exactly 42 characters (0x + 40 hex characters)`;
      } else if (!hasValidChars) {
        errorDetail = "Address contains invalid characters. Only 0-9 and a-f are allowed after 0x";
      } else {
        errorDetail = "Invalid wallet address format";
      }
      
      newErrors.contractorAddress = `Invalid wallet address: ${errorDetail}\n\n` +
        `You entered: "${trimmedAddress}"\n` +
        `Length: ${length} characters\n` +
        `Expected: 42 characters (e.g., 0xcbf77a3f7204b3179ea8de382c7c9ff7e19081d8)`;
    }

    const amountValidation = validateEthAmount(formData.fundsAmount);
    if (!amountValidation.isValid) {
      newErrors.fundsAmount = amountValidation.error || "Invalid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validateForm()) return;
    
    try {
      // Trim the contractor address before submitting
      const trimmedAddress = formData.contractorAddress.trim();
      const result = await createProposal(
        formData.description,
        trimmedAddress,
        formData.fundsAmount
      );
      
      // Extract transaction hash if available
      const txHash = result?.transactionHash || result?.hash || result?.receipt?.transactionHash || (typeof result === 'string' ? result : null);
      
      if (txHash) {
        const blockExplorerUrl = `https://moonbase.moonscan.io/tx/${txHash}`;
        setSuccessMessage(`PROPOSAL_CREATED_SUCCESS|${txHash}|${blockExplorerUrl}`);
      } else {
        setSuccessMessage("PROPOSAL_CREATED_SUCCESS|NO_HASH");
      }
      setFormData({ description: "", contractorAddress: "", fundsAmount: "" });
      setErrors({});
    } catch (error: any) {
      // Filter out harmless thirdweb analytics errors from console
      const errorStr = JSON.stringify(error || "").toLowerCase();
      const isHarmlessError = errorStr.includes("thirdweb.com/event") || 
                              errorStr.includes("social.thirdweb.com") ||
                              errorStr.includes("401") && errorStr.includes("thirdweb");
      
      // Only log non-harmless errors
      if (!isHarmlessError) {
        console.error("Failed to create proposal:", error);
      }
      
      // Extract more detailed error message - try decoded revert reason first
      let errorMessage = "Failed to create proposal. Please try again.";
      
      // Check if we have a decoded revert reason or user-friendly message
      if (error?.decodedReason) {
        errorMessage = error.decodedReason;
      } else if (error?.userFriendlyMessage) {
        errorMessage = error.userFriendlyMessage;
      } else {
        // Try to decode it ourselves
        const decodedReason = decodeRevertReason(error);
        if (decodedReason) {
          errorMessage = decodedReason;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.reason) {
          errorMessage = error.reason;
        } else if (typeof error === "string") {
          errorMessage = error;
        }
      }
      
      // If we still have a generic message, try to get a user-friendly one
      if (errorMessage === "Failed to create proposal. Please try again." || errorMessage.includes("Execution Reverted")) {
        const userFriendly = getTransactionErrorMessage(error, {
          fundsAmount: formData.fundsAmount,
          contractAddress: formData.contractorAddress,
          userAddress: account?.address,
        });
        if (userFriendly !== "❌ Transaction Failed: Please check the console for details.") {
          errorMessage = userFriendly;
        }
      }
      
      // ALWAYS check contract address first - this is the most common issue
      const currentContract = CONTRACT_ADDRESS.toLowerCase();
      const oldContract = "0x85adb25f3269ebe8472e523e8dcb978ceec4c1cf";
      const newContract = "0x71864a1cb9409879fd8b51f4c5a0e09025beec80";
      
      // Check error object for contract address
      const errorContractAddress = error?.contract?.address?.toLowerCase() || 
                                   error?.data?.contractAddress?.toLowerCase() || 
                                   errorStr.match(/0x[a-f0-9]{40}/)?.[0]?.toLowerCase() || "";
      
      // If using old contract, show clear error - THIS IS THE MOST COMMON ISSUE
      if (currentContract === oldContract || errorContractAddress === oldContract || errorStr.includes("0x85adb25f3269ebe8472e523e8dcb978ceec4c1cf")) {
        errorMessage = "🚨 CRITICAL: USING OLD CONTRACT ADDRESS!\n\n" +
          "Current Contract: 0x85ADB25F3269EBe8472e523e8DcB978CEEC4c1CF (OLD)\n" +
          "Required Contract: 0x71864A1CB9409879Fd8B51f4c5A0e09025beeC80 (NEW)\n\n" +
          "The dev server needs to be restarted to load the new contract address.\n\n" +
          "🔧 STEP-BY-STEP FIX:\n" +
          "1. Go to your terminal\n" +
          "2. Press Ctrl+C to stop the dev server\n" +
          "3. Run: npm run dev\n" +
          "4. Wait for 'Ready' message\n" +
          "5. Come back here and refresh (F5)\n" +
          "6. Try creating proposal again\n\n" +
          "The warning above should disappear once the correct contract is loaded.";
      }
      // Check for execution reverted (could be admin, funds, or other issues)
      else if (errorMessage.includes("Execution Reverted") || errorMessage.includes("execution reverted") || errorStr.includes("revert")) {
        // Check if error data is empty ("0x") - this usually means a modifier failed
        const hasEmptyData = error?.data === '0x' || error?.data === '' || 
                            (typeof error?.data === 'string' && error?.data.trim() === '0x');
        
        if (hasEmptyData) {
          // Empty revert data typically means:
          // 1. onlyAdmin modifier failed
          // 2. A require() failed without a message
          errorMessage = "❌ Transaction Reverted (Empty Revert Data)\n\n" +
            "The contract rejected the transaction but didn't provide a reason.\n" +
            "Possible causes:\n\n" +
            "1️⃣ INSUFFICIENT FUNDS SENT\n" +
            "   → Required: " + formData.fundsAmount + " DEV for escrow\n" +
            "   → Check MetaMask shows the correct amount when confirming\n" +
            "   → Need escrow amount + ~0.01 DEV for gas\n\n" +
            "2️⃣ INVALID CONTRACTOR ADDRESS\n" +
            "   → Address: " + formData.contractorAddress + "\n" +
            "   → Must be valid 42-character address starting with 0x\n\n" +
            "3️⃣ INVALID DESCRIPTION\n" +
            "   → Description cannot be empty\n\n" +
            "💡 Tip: Check the browser console for detailed error logs.";
        } else {
          errorMessage = "❌ Contract execution reverted. Possible causes:\n\n" +
            "1️⃣ INSUFFICIENT DEV TOKENS\n" +
            "   → Need " + formData.fundsAmount + " DEV for escrow + ~0.01 DEV for gas\n" +
            "   → Check MetaMask balance\n" +
            "   → Get more: https://apps.moonbeam.network/moonbase-alpha/faucet/\n\n" +
            "2️⃣ INVALID CONTRACTOR ADDRESS\n" +
            "   → Verify contractor address is valid (42 chars, starts with 0x)\n\n" +
            "3️⃣ INVALID DESCRIPTION\n" +
            "   → Description cannot be empty\n\n" +
            "4️⃣ WRONG NETWORK\n" +
            "   → Make sure you're on Moonbase Alpha (Chain ID: 1287)";
        }
      } 
      // Check for insufficient funds (this is the msg.value >= _fundsEscrowed check)
      else if (errorStr.includes("insufficient funds sent") || errorStr.includes("insufficient") && errorStr.includes("funds")) {
        errorMessage = "❌ INSUFFICIENT FUNDS SENT!\n\n" +
          "⚠️ CRITICAL: The transaction did not send enough DEV tokens.\n\n" +
          "Contract Requirement:\n" +
          "→ Must send at least " + formData.fundsAmount + " DEV with the transaction\n" +
          "→ This is the 'msg.value' that must match or exceed '_fundsEscrowed'\n\n" +
          "What This Means:\n" +
          "→ The frontend should automatically send " + formData.fundsAmount + " DEV\n" +
          "→ But MetaMask might not be including it, or the amount is wrong\n\n" +
          "Check:\n" +
          "→ When MetaMask pops up, verify it shows " + formData.fundsAmount + " DEV being sent\n" +
          "→ Your balance: Check if you have enough DEV tokens\n" +
          "→ You need " + formData.fundsAmount + " DEV for escrow + ~0.01 DEV for gas\n" +
          "→ Total needed: " + (parseFloat(formData.fundsAmount) + 0.01).toFixed(2) + " DEV\n\n" +
          "Get more tokens:\n" +
          "→ https://apps.moonbeam.network/moonbase-alpha/faucet/";
      } 
      // Check for user rejection
      else if (errorStr.includes("user rejected") || errorStr.includes("denied") || errorStr.includes("rejected")) {
        errorMessage = "⚠️ Transaction was REJECTED in MetaMask.\n\n" +
          "→ Click 'Confirm' when MetaMask pops up\n" +
          "→ Make sure you approve sending " + formData.fundsAmount + " DEV\n" +
          "→ Try again and confirm the transaction";
      } 
      // Check for network error
      else if (errorStr.includes("network") || errorStr.includes("chain")) {
        errorMessage = "❌ Network Error!\n\n" +
          "→ Switch MetaMask to Moonbase Alpha (Chain ID: 1287)\n" +
          "→ Make sure you're on the correct network";
      }
      
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Create New Proposal
      </h3>

      {contractWarning && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">{contractWarning}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Proposal Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the maintenance or repair work needed..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-vertical ${
              errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <p className="text-gray-500 text-sm ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Contractor Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contractor Address
          </label>
          <input
            type="text"
            placeholder="0x1234567890123456789012345678901234567890"
            value={formData.contractorAddress}
            onChange={(e) => setFormData({ ...formData, contractorAddress: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.contractorAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.contractorAddress && (
            <div className="text-red-500 text-sm mt-1 whitespace-pre-line bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
              {errors.contractorAddress}
            </div>
          )}
          <p className="text-gray-500 text-sm mt-1">
            💡 Tip: Copy your MetaMask address and paste it here. It should look like: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Address of the contractor or organization responsible for the work
          </p>
          {account && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contractorAddress: account.address })}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              💡 Use my wallet address: {account.address}
            </button>
          )}
        </div>

        {/* Funds Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Escrowed Funds (DEV)
          </label>
          <input
            type="text"
            placeholder="5.0"
            value={formData.fundsAmount}
            onChange={(e) => setFormData({ ...formData, fundsAmount: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.fundsAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.fundsAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.fundsAmount}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Total amount to be escrowed for this proposal
          </p>
          {formData.fundsAmount && parseFloat(formData.fundsAmount) > 0 && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-blue-800 dark:text-blue-200 text-xs font-semibold mb-1">
                💡 Important: MetaMask will ask you to confirm
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                When you click "Create Proposal", MetaMask will pop up asking you to send{" "}
                <strong>{formData.fundsAmount} DEV</strong> to the contract. This amount will be{" "}
                <strong>escrowed</strong> (locked) in the contract until milestones are completed.
                Make sure you have enough DEV tokens in your wallet (+ ~0.01 DEV for gas fees)!
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isPending ? "Creating..." : "Create Proposal"}
        </button>

        {/* Messages */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <div className="text-2xl mr-3">❌</div>
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-bold text-lg mb-2">
                  Error Creating Proposal
                </p>
                <div className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">
                  {errors.submit}
                </div>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600 rounded-lg p-4 mt-4 animate-fade-in">
            <div className="flex items-start">
              <div className="text-3xl mr-3">✅</div>
              <div className="flex-1">
                <p className="text-green-800 dark:text-green-200 font-bold text-lg mb-2">
                  🎉 Proposal Created Successfully!
                </p>
                {successMessage.startsWith("PROPOSAL_CREATED_SUCCESS|") ? (
                  <>
                    {successMessage.includes("|NO_HASH") ? (
                      <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                        Your proposal has been created and submitted to the blockchain. Check your MetaMask wallet for transaction details.
                      </p>
                    ) : (
                      <>
                        <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                          Your proposal has been successfully created and is now active on the blockchain!
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded p-3 mb-3">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transaction Hash:</p>
                          <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                            {successMessage.split("|")[1]}
                          </p>
                        </div>
                        <a
                          href={successMessage.split("|")[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                          🔗 View on Moonscan Explorer
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {successMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
