"use client";

import { useState } from "react";
import { useProposalActions, useGovernanceContract } from "@/hooks/contract";

export function ProposalFinalization() {
  const { finalizeProposal, isPending } = useProposalActions();
  const { proposalCount } = useGovernanceContract();
  const [proposalId, setProposalId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const id = parseInt(proposalId);

    if (!proposalId || isNaN(id) || id < 1) {
      newErrors.proposalId = "Invalid proposal ID";
    }

    if (proposalCount && id > Number(proposalCount)) {
      newErrors.proposalId = `Proposal ID must be between 1 and ${proposalCount}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      await finalizeProposal(parseInt(proposalId));
      setSuccessMessage(`Proposal ${proposalId} finalized successfully!`);
      setProposalId("");
      setErrors({});
    } catch (error) {
      console.error("Failed to finalize proposal:", error);
      setErrors({ submit: "Failed to finalize proposal. Please try again." });
    }
  };

  return (
    <div className="card-premium">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D946A6]/10 to-[#C026A3]/10 dark:from-[#EC4899]/20 dark:to-[#D946A6]/20 backdrop-blur-sm">
          <span className="text-2xl">✅</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
            Finalize Proposal
          </h3>
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-medium">
            Finalize voting results
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
            Proposal ID
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
              errors.proposalId 
                ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            }`}
          />
          {errors.proposalId && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.proposalId}</p>
          )}
          <p className="text-xs text-black/50 dark:text-white/50 mt-2 font-medium">
            Enter the ID of the proposal to finalize (Total proposals: {Number(proposalCount) || 0})
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-premium bg-gradient-to-r from-[#D946A6] to-[#C026A3] hover:from-[#C026A3] hover:to-[#A61D7A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
        >
          <span className="relative z-10">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Finalizing...
              </span>
            ) : (
              "Finalize Proposal"
            )}
          </span>
        </button>

        {errors.submit && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 border-2 border-red-500/30 animate-scale-in">
            <p className="text-sm text-white font-semibold">{errors.submit}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-4 border-2 border-[#10B981]/30 animate-scale-in">
            <p className="text-sm text-white font-semibold">{successMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
}
