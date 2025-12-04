"use client";

import { useState } from "react";
import { useProposalActions } from "@/hooks/contract";
import { validateEthereumAddress, validateProposalDescription, validateEthAmount } from "@/utils/contractUtils";
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const descValidation = validateProposalDescription(formData.description);
    if (!descValidation.isValid) {
      newErrors.description = descValidation.error || "Invalid description";
    }

    const trimmedAddress = formData.contractorAddress.trim();
    if (!trimmedAddress) {
      newErrors.contractorAddress = "Contractor address is required";
    } else if (!validateEthereumAddress(trimmedAddress)) {
      newErrors.contractorAddress = "Invalid wallet address format";
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
      const trimmedAddress = formData.contractorAddress.trim();
      const result = await createProposal(
        formData.description,
        trimmedAddress,
        formData.fundsAmount
      );
      
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
      const errorStr = JSON.stringify(error || "").toLowerCase();
      const isHarmlessError = errorStr.includes("thirdweb.com/event") || 
                              errorStr.includes("social.thirdweb.com") ||
                              (errorStr.includes("401") && errorStr.includes("thirdweb"));
      
      if (!isHarmlessError) {
        console.error("Failed to create proposal:", error);
      }
      
      let errorMessage = error?.decodedReason || error?.userFriendlyMessage || error?.message || "Failed to create proposal. Please try again.";
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="card-premium p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 dark:from-[#3B82F6]/20 dark:to-[#2563EB]/20 backdrop-blur-sm">
          <span className="text-2xl">📝</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-black dark:text-white tracking-tight">
            Create Proposal
          </h3>
          <p className="text-sm text-black/60 dark:text-white/60 font-medium">
            Submit a new governance proposal
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-3">
            Description
          </label>
          <textarea
            rows={5}
            placeholder="Describe the maintenance or repair work needed..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium resize-vertical ${
              errors.description 
                ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.description}</p>
          )}
          <p className="text-xs text-black/50 dark:text-white/50 mt-2 font-medium">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Contractor Address */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-3">
            Contractor Address
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="0x..."
              value={formData.contractorAddress}
              onChange={(e) => setFormData({ ...formData, contractorAddress: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-mono text-sm ${
                errors.contractorAddress 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              }`}
            />
          </div>
          {errors.contractorAddress && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.contractorAddress}</p>
          )}
          {account && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contractorAddress: account.address })}
              className="mt-2 text-xs text-[#2563EB] dark:text-[#3B82F6] hover:underline font-semibold transition-colors"
            >
              Use my wallet address →
            </button>
          )}
        </div>

        {/* Funds Amount */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-3">
            Escrowed Funds (DEV)
          </label>
          <input
            type="text"
            placeholder="5.0"
            value={formData.fundsAmount}
            onChange={(e) => setFormData({ ...formData, fundsAmount: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
              errors.fundsAmount 
                ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            }`}
          />
          {errors.fundsAmount && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.fundsAmount}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-premium bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
        >
          <span className="relative z-10">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating...
              </span>
            ) : (
              "Create Proposal"
            )}
          </span>
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-6 border-2 border-[#10B981]/30 animate-scale-in backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✅</span>
              <div className="flex-1">
                <p className="text-lg font-bold text-white mb-2">
                  Proposal Created!
                </p>
                {successMessage.includes("|") && !successMessage.includes("NO_HASH") && (
                  <a
                    href={successMessage.split("|")[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
                  >
                    View on Moonscan →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 border-2 border-red-500/30 animate-scale-in backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">❌</span>
              <div className="flex-1">
                <p className="text-lg font-bold text-white mb-2">
                  Error
                </p>
                <p className="text-sm text-white/90 whitespace-pre-line font-medium">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
