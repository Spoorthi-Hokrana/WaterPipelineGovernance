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
    <div className="card-premium">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 dark:from-[#22C55E]/20 dark:to-[#10B981]/20 backdrop-blur-sm">
          <span className="text-2xl">🎯</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
            Milestone Management
          </h3>
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-medium">
            Manage project milestones
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-black/5 dark:bg-white/5 rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "add"
              ? "bg-white dark:bg-[#1A1A1A] text-[#2563EB] dark:text-[#3B82F6] shadow-md"
              : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          }`}
        >
          Add Milestone
        </button>
        <button
          onClick={() => setActiveTab("complete")}
          className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "complete"
              ? "bg-white dark:bg-[#1A1A1A] text-[#10B981] dark:text-[#22C55E] shadow-md"
              : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          }`}
        >
          Complete Milestone
        </button>
      </div>

      {/* Add Milestone Form */}
      {activeTab === "add" && (
        <form onSubmit={handleAddSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Proposal ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={addForm.proposalId}
              onChange={(e) => setAddForm({ ...addForm, proposalId: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
                errors.proposalId 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              }`}
            />
            {errors.proposalId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.proposalId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Milestone Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the milestone..."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 resize-none ${
                errors.description 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Target Date
            </label>
            <input
              type="date"
              value={addForm.targetDate}
              onChange={(e) => setAddForm({ ...addForm, targetDate: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white focus:outline-none transition-all duration-200 ${
                errors.targetDate 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              }`}
            />
            {errors.targetDate && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.targetDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Release Amount (DEV)
            </label>
            <input
              type="text"
              placeholder="1.0"
              value={addForm.releaseAmount}
              onChange={(e) => setAddForm({ ...addForm, releaseAmount: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
                errors.releaseAmount 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              }`}
            />
            {errors.releaseAmount && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.releaseAmount}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-premium bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            <span className="relative z-10">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : (
                "Add Milestone"
              )}
            </span>
          </button>
        </form>
      )}

      {/* Complete Milestone Form */}
      {activeTab === "complete" && (
        <form onSubmit={handleCompleteSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Proposal ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={completeForm.proposalId}
              onChange={(e) => setCompleteForm({ ...completeForm, proposalId: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
                errors.proposalId 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              }`}
            />
            {errors.proposalId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.proposalId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
              Milestone ID
            </label>
            <input
              type="number"
              placeholder="1"
              value={completeForm.milestoneId}
              onChange={(e) => setCompleteForm({ ...completeForm, milestoneId: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
                errors.milestoneId 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                  : "border-black/10 dark:border-white/10 focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/10"
              }`}
            />
            {errors.milestoneId && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.milestoneId}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full btn-premium bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            <span className="relative z-10">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Completing...
                </span>
              ) : (
                "Complete Milestone"
              )}
            </span>
          </button>
        </form>
      )}

      {/* Messages */}
      {errors.submit && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 border-2 border-red-500/30 animate-scale-in mt-4">
          <p className="text-sm text-white font-semibold">{errors.submit}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-4 border-2 border-[#10B981]/30 animate-scale-in mt-4">
          <p className="text-sm text-white font-semibold">{successMessage}</p>
        </div>
      )}
    </div>
  );
}
