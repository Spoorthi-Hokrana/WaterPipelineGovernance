"use client";

import { useState } from "react";
import { useVoterActions, VoterType, getVoterTypeText } from "@/hooks/contract";
import { validateEthereumAddress, validateVoterWeight } from "@/utils/contractUtils";
import { useActiveAccount } from "thirdweb/react";

export function VoterRegistration() {
  const { registerVoter, isPending } = useVoterActions();
  const account = useActiveAccount();
  const [formData, setFormData] = useState({
    address: "",
    type: VoterType.Citizen,
    weight: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEthereumAddress(formData.address)) {
      newErrors.address = "Invalid wallet address. Must start with 0x and have 42 characters";
    }

    const weightValidation = validateVoterWeight(parseInt(formData.weight));
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error || "Invalid weight";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      await registerVoter(
        formData.address,
        formData.type,
        parseInt(formData.weight)
      );
      
      setSuccessMessage("Voter registered successfully!");
      setFormData({ address: "", type: VoterType.Citizen, weight: "1" });
      setErrors({});
    } catch (error) {
      console.error("Failed to register voter:", error);
      setErrors({ submit: "Failed to register voter. Please try again." });
    }
  };

  return (
    <div className="card-premium">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 dark:from-[#3B82F6]/20 dark:to-[#2563EB]/20 backdrop-blur-sm">
          <span className="text-2xl">🗳️</span>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
            Register Voter
          </h3>
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 font-medium">
            Register new voters in the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Address Input */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
            Voter Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-mono text-sm ${
              errors.address 
                ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            }`}
          />
          {errors.address && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.address}</p>
          )}
          {account && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, address: account.address })}
              className="mt-2 text-xs text-[#2563EB] dark:text-[#3B82F6] hover:underline font-semibold transition-colors"
            >
              Use my wallet address →
            </button>
          )}
        </div>

        {/* Voter Type */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
            Voter Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as VoterType })}
            className="w-full px-4 py-3 rounded-xl border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#0F0F0F] text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all duration-200 font-medium"
          >
            <option value={VoterType.Municipal}>
              🏛️ {getVoterTypeText(VoterType.Municipal)} (High Authority)
            </option>
            <option value={VoterType.Engineer}>
              👷 {getVoterTypeText(VoterType.Engineer)} (Technical Expert)
            </option>
            <option value={VoterType.Citizen}>
              👤 {getVoterTypeText(VoterType.Citizen)} (Community Member)
            </option>
          </select>
        </div>

        {/* Voting Weight */}
        <div>
          <label className="block text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3">
            Voting Weight
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-[#0F0F0F] text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none transition-all duration-200 font-medium ${
              errors.weight 
                ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                : "border-black/10 dark:border-white/10 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
            }`}
          />
          {errors.weight && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium animate-slide-in">{errors.weight}</p>
          )}
          <p className="text-xs text-black/50 dark:text-white/50 mt-2 font-medium">
            Recommended: Municipal (50-100), Engineer (20-50), Citizen (1-10)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full btn-premium bg-gradient-to-r from-[#2563EB] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
        >
          <span className="relative z-10">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Registering...
              </span>
            ) : (
              "Register Voter"
            )}
          </span>
        </button>

        {/* Messages */}
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
