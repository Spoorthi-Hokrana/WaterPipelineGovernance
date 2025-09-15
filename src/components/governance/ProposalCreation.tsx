"use client";

import { useState } from "react";
import { useProposalActions } from "@/hooks/contract";
import { validateEthereumAddress, validateProposalDescription, validateEthAmount } from "@/utils/contractUtils";

export function ProposalCreation() {
  const { createProposal, isPending } = useProposalActions();
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

    if (!validateEthereumAddress(formData.contractorAddress)) {
      newErrors.contractorAddress = "Invalid contractor address";
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

    if (!validateForm()) return;

    try {
      await createProposal(
        formData.description,
        formData.contractorAddress,
        formData.fundsAmount
      );
      
      setSuccessMessage("Proposal created successfully!");
      setFormData({ description: "", contractorAddress: "", fundsAmount: "" });
      setErrors({});
    } catch (error) {
      console.error("Failed to create proposal:", error);
      setErrors({ submit: "Failed to create proposal. Please try again." });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📋 Create New Proposal
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Anyone can create proposals for community consideration. Describe the work needed and funding requirements.
      </p>

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
            <p className="text-red-500 text-sm mt-1">{errors.contractorAddress}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Address of the contractor or organization responsible for the work
          </p>
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
            Total amount to be escrowed for this proposal (on Moonbase Alpha)
          </p>
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
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
