"use client";

import { useState, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  txHash: string | null;
}

export function useTransaction() {
  const { notifications } = useAppContext();
  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  });

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
    });
  }, []);

  const executeTransaction = useCallback(async (
    transactionFn: () => Promise<any>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      loadingMessage?: string;
    }
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      
      if (options?.loadingMessage) {
        notifications.info(options.loadingMessage, "Transaction Pending");
      }

      const result = await transactionFn();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: true,
        txHash: result?.hash || result?.transactionHash || null,
      }));

      notifications.success(
        options?.successMessage || "Transaction completed successfully!",
        "Success"
      );

      return result;
    } catch (error: any) {
      const errorMessage = error?.message || error?.reason || "Transaction failed";
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage,
      }));

      notifications.error(
        options?.errorMessage || errorMessage,
        "Transaction Failed"
      );

      throw error;
    }
  }, [notifications]);

  return {
    ...state,
    executeTransaction,
    reset,
  };
}
