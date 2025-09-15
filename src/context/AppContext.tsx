"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "@/hooks/ui/useNotifications";

interface AppContextType {
  notifications: ReturnType<typeof useNotifications>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const notifications = useNotifications();

  return (
    <AppContext.Provider value={{ notifications }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
