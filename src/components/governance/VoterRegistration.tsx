"use client";

import { useState } from "react";
import { useVoterActions, VoterType, getVoterTypeText } from "@/hooks/contract";
import { validateEthereumAddress, validateVoterWeight } from "@/utils/contractUtils";

export function VoterRegistration() {
  const { registerVoter, isPending } = useVoterActions();
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
      newErrors.address = "Invalid Ethereum address";
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
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🗳️ Register New Voter
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Anyone can register voters in this decentralized system. Add community members with appropriate voting weights.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Voter Address
          </label>
          <input
            type="text"
            placeholder="0x1234567890123456789012345678901234567890"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Voter Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Voter Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as VoterType })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Voting Weight
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.weight ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            Recommended: Municipal (50-100), Engineer (20-50), Citizen (1-10)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isPending ? "Registering..." : "Register Voter"}
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
