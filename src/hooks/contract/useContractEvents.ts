"use client";

import { useEffect, useState } from "react";
import { waterPipelineContract } from "@/lib/contract/config";
import { useAppContext } from "@/context/AppContext";

interface ContractEvent {
  eventName: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
  timestamp: number;
}

export function useContractEvents() {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { notifications } = useAppContext();

  useEffect(() => {
    if (!waterPipelineContract) return;

    setIsListening(true);

    // Note: This is a simplified event listening implementation
    // In a production app, you'd want to use the thirdweb event listening API
    // or web3 providers to listen for real-time events

    const handleProposalCreated = (id: any, description: string) => {
      const event: ContractEvent = {
        eventName: "ProposalCreated",
        args: [id, description],
        blockNumber: 0, // Would be populated by actual event
        transactionHash: "", // Would be populated by actual event
        timestamp: Date.now(),
      };

      setEvents(prev => [event, ...prev].slice(0, 50)); // Keep only last 50 events
      
      notifications.info(
        `New proposal created: ${description.substring(0, 50)}...`,
        "Proposal Created"
      );
    };

    const handleVoteCast = (voter: string, proposalId: any, support: boolean, weight: any) => {
      const event: ContractEvent = {
        eventName: "VoteCast",
        args: [voter, proposalId, support, weight],
        blockNumber: 0,
        transactionHash: "",
        timestamp: Date.now(),
      };

      setEvents(prev => [event, ...prev].slice(0, 50));
      
      notifications.info(
        `Vote cast on proposal #${proposalId.toString()}: ${support ? "Yes" : "No"}`,
        "Vote Cast"
      );
    };

    const handleMilestoneCompleted = (proposalId: any, milestoneId: any) => {
      const event: ContractEvent = {
        eventName: "MilestoneCompleted",
        args: [proposalId, milestoneId],
        blockNumber: 0,
        transactionHash: "",
        timestamp: Date.now(),
      };

      setEvents(prev => [event, ...prev].slice(0, 50));
      
      notifications.success(
        `Milestone ${milestoneId.toString()} completed for proposal #${proposalId.toString()}`,
        "Milestone Completed"
      );
    };

    // In a real implementation, you would set up actual event listeners here
    // Example with ethers or web3:
    // contract.on("ProposalCreated", handleProposalCreated);
    // contract.on("VoteCast", handleVoteCast);
    // contract.on("MilestoneCompleted", handleMilestoneCompleted);

    return () => {
      setIsListening(false);
      // Cleanup event listeners
      // contract.removeAllListeners();
    };
  }, [notifications]);

  return {
    events,
    isListening,
  };
}

// Hook for polling contract data at regular intervals
export function useContractPolling(intervalMs: number = 30000) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { lastUpdate };
}
