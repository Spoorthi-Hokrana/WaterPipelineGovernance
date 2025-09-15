"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useMilestoneActions, useGovernanceContract, ProposalStatus } from "@/hooks/contract";
import { validateEthAmount } from "@/utils/contractUtils";

interface MilestoneManagerProps {
  proposalId: number;
  onMilestoneAdded?: () => void;
}

export function MilestoneManager({ proposalId, onMilestoneAdded }: MilestoneManagerProps) {
  const account = useActiveAccount();
  const { addMilestone, completeMilestone, isPending } = useMilestoneActions();
  const { isAdmin } = useGovernanceContract();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    targetDate: "",
    releaseAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const canManageMilestones = account && isAdmin(account.address);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Target date is required";
    } else {
      const targetDate = new Date(formData.targetDate);
      if (targetDate <= new Date()) {
        newErrors.targetDate = "Target date must be in the future";
      }
    }

    const amountValidation = validateEthAmount(formData.releaseAmount);
    if (!amountValidation.isValid) {
      newErrors.releaseAmount = amountValidation.error || "Invalid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      await addMilestone(
        proposalId,
        formData.description,
        new Date(formData.targetDate),
        formData.releaseAmount
      );
      
      setSuccessMessage("Milestone added successfully!");
      setFormData({ description: "", targetDate: "", releaseAmount: "" });
      setErrors({});
      setShowAddForm(false);
      onMilestoneAdded?.();
    } catch (error) {
      console.error("Failed to add milestone:", error);
      setErrors({ submit: "Failed to add milestone. Please try again." });
    }
  };

  const handleCompleteMilestone = async (milestoneId: number) => {
    try {
      await completeMilestone(proposalId, milestoneId);
      setSuccessMessage(`Milestone ${milestoneId} marked as complete!`);
      onMilestoneAdded?.(); // Refresh data
    } catch (error) {
      console.error("Failed to complete milestone:", error);
      setErrors({ submit: "Failed to complete milestone. Please try again." });
    }
  };

  if (!canManageMilestones) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Only administrators can manage milestones.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Milestone Management
        </h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            Add Milestone
          </button>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Add New Milestone</h4>
            <button
              onClick={() => {
                setShowAddForm(false);
                setErrors({});
                setFormData({ description: "", targetDate: "", releaseAmount: "" });
              }}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Milestone Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe what needs to be completed for this milestone..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white resize-vertical ${
                  errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-500"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Target Date and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white ${
                    errors.targetDate ? "border-red-500" : "border-gray-300 dark:border-gray-500"
                  }`}
                />
                {errors.targetDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Release Amount (ETH)
                </label>
                <input
                  type="text"
                  placeholder="1.5"
                  value={formData.releaseAmount}
                  onChange={(e) => setFormData({ ...formData, releaseAmount: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-600 dark:text-white ${
                    errors.releaseAmount ? "border-red-500" : "border-gray-300 dark:border-gray-500"
                  }`}
                />
                {errors.releaseAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.releaseAmount}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isPending ? "Adding..." : "Add Milestone"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Error Messages */}
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </form>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>Note:</strong> Milestones can only be added to proposals that have passed voting.
        </p>
        <p>
          Use milestones to break down project work into manageable phases with specific fund releases.
        </p>
      </div>
    </div>
  );
}
