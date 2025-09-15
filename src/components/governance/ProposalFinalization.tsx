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
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        ✅ Finalize Proposal
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Anyone can finalize proposals that have passed their voting deadline. This determines if they passed or failed.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Proposal ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Proposal ID
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.proposalId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.proposalId && (
            <p className="text-red-500 text-sm mt-1">{errors.proposalId}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Enter the ID of the proposal to finalize (Total proposals: {Number(proposalCount) || 0})
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isPending ? "Finalizing..." : "Finalize Proposal"}
        </button>

        {/* Messages */}
        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
