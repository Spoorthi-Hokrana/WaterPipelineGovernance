"use client";

import { useState } from "react";
import { useMilestoneActions } from "@/hooks/contract";

export function MilestoneManagement() {
  const { addMilestone, completeMilestone, isPending } = useMilestoneActions();
  const [activeTab, setActiveTab] = useState<"add" | "complete">("add");
  const [addForm, setAddForm] = useState({
    proposalId: "",
    description: "",
    targetDate: "",
    releaseAmount: "",
  });
  const [completeForm, setCompleteForm] = useState({
    proposalId: "",
    milestoneId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateAddForm = () => {
    const newErrors: Record<string, string> = {};

    if (!addForm.proposalId || isNaN(parseInt(addForm.proposalId))) {
      newErrors.proposalId = "Invalid proposal ID";
    }

    if (!addForm.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!addForm.targetDate) {
      newErrors.targetDate = "Target date is required";
    }

    if (!addForm.releaseAmount || isNaN(parseFloat(addForm.releaseAmount))) {
      newErrors.releaseAmount = "Invalid release amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCompleteForm = () => {
    const newErrors: Record<string, string> = {};

    if (!completeForm.proposalId || isNaN(parseInt(completeForm.proposalId))) {
      newErrors.proposalId = "Invalid proposal ID";
    }

    if (!completeForm.milestoneId || isNaN(parseInt(completeForm.milestoneId))) {
      newErrors.milestoneId = "Invalid milestone ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateAddForm()) return;

    try {
      await addMilestone(
        parseInt(addForm.proposalId),
        addForm.description,
        Math.floor(new Date(addForm.targetDate).getTime() / 1000),
        addForm.releaseAmount
      );
      
      setSuccessMessage("Milestone added successfully!");
      setAddForm({ proposalId: "", description: "", targetDate: "", releaseAmount: "" });
      setErrors({});
    } catch (error) {
      console.error("Failed to add milestone:", error);
      setErrors({ submit: "Failed to add milestone. Please try again." });
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateCompleteForm()) return;

    try {
      await completeMilestone(
        parseInt(completeForm.proposalId),
        parseInt(completeForm.milestoneId)
      );
      
      setSuccessMessage("Milestone completed successfully!");
      setCompleteForm({ proposalId: "", milestoneId: "" });
      setErrors({});
    } catch (error) {
      console.error("Failed to complete milestone:", error);
      setErrors({ submit: "Failed to complete milestone. Please try again." });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🎯 Milestone Management
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Manage project milestones and fund releases. Anyone can add milestones to passed proposals and mark them complete.
      </p>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "add"
              ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          Add Milestone
        </button>
        <button
          onClick={() => setActiveTab("complete")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "complete"
              ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
          }`}
        >
          Complete Milestone
        </button>
      </div>

      {/* Add Milestone Form */}
      {activeTab === "add" && (
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proposal ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={addForm.proposalId}
              onChange={(e) => setAddForm({ ...addForm, proposalId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.proposalId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.proposalId && (
              <p className="text-red-500 text-sm mt-1">{errors.proposalId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Milestone Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the milestone..."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={addForm.targetDate}
              onChange={(e) => setAddForm({ ...addForm, targetDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.targetDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.targetDate && (
              <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Release Amount (DEV)
            </label>
            <input
              type="text"
              placeholder="1.0"
              value={addForm.releaseAmount}
              onChange={(e) => setAddForm({ ...addForm, releaseAmount: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.releaseAmount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.releaseAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.releaseAmount}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isPending ? "Adding..." : "Add Milestone"}
          </button>
        </form>
      )}

      {/* Complete Milestone Form */}
      {activeTab === "complete" && (
        <form onSubmit={handleCompleteSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proposal ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={completeForm.proposalId}
              onChange={(e) => setCompleteForm({ ...completeForm, proposalId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${
                errors.proposalId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.proposalId && (
              <p className="text-red-500 text-sm mt-1">{errors.proposalId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Milestone ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={completeForm.milestoneId}
              onChange={(e) => setCompleteForm({ ...completeForm, milestoneId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white ${
                errors.milestoneId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.milestoneId && (
              <p className="text-red-500 text-sm mt-1">{errors.milestoneId}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {isPending ? "Completing..." : "Complete Milestone"}
          </button>
        </form>
      )}

      {/* Messages */}
      {errors.submit && (
        <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mt-4">{successMessage}</p>
      )}
    </div>
  );
}
