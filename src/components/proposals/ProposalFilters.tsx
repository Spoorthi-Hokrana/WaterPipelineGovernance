"use client";

import { ProposalStatus, getProposalStatusText } from "@/hooks/contract";

interface ProposalFiltersProps {
  selectedStatus: ProposalStatus | "all";
  onStatusChange: (status: ProposalStatus | "all") => void;
  sortBy: "newest" | "oldest" | "deadline";
  onSortChange: (sort: "newest" | "oldest" | "deadline") => void;
}

export function ProposalFilters({
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: ProposalFiltersProps) {
  const statusOptions = [
    { value: "all" as const, label: "All Proposals", count: null },
    { value: ProposalStatus.Active, label: getProposalStatusText(ProposalStatus.Active), count: null },
    { value: ProposalStatus.Passed, label: getProposalStatusText(ProposalStatus.Passed), count: null },
    { value: ProposalStatus.Failed, label: getProposalStatusText(ProposalStatus.Failed), count: null },
    { value: ProposalStatus.Executed, label: getProposalStatusText(ProposalStatus.Executed), count: null },
  ];

  const sortOptions = [
    { value: "newest" as const, label: "Newest First" },
    { value: "oldest" as const, label: "Oldest First" },
    { value: "deadline" as const, label: "By Deadline" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value === "all" ? "all" : parseInt(e.target.value) as ProposalStatus)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "newest" | "oldest" | "deadline")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="flex-1">
          <div className="text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                <p className="text-blue-600 dark:text-blue-400 font-medium">Active</p>
                <p className="text-blue-800 dark:text-blue-200">0</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                <p className="text-green-600 dark:text-green-400 font-medium">Passed</p>
                <p className="text-green-800 dark:text-green-200">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
