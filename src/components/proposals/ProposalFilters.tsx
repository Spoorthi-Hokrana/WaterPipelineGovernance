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
    <div className="card-premium p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-black dark:text-white mb-2">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value === "all" ? "all" : parseInt(e.target.value) as ProposalStatus)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#0F0F0F] text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all duration-200 font-medium"
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
          <label className="block text-sm font-semibold text-black dark:text-white mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "newest" | "oldest" | "deadline")}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-black/10 dark:border-white/10 bg-white dark:bg-[#0F0F0F] text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 focus:border-[#2563EB] transition-all duration-200 font-medium"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
