"use client";

import { ThirdwebProvider as Provider } from "thirdweb/react";
import { client, DEFAULT_CHAIN } from "@/lib/thirdweb";
import { validateEnv } from "@/config/env";
import { useEffect } from "react";

interface ThirdwebProviderProps {
  children: React.ReactNode;
}

export function ThirdwebProvider({ children }: ThirdwebProviderProps) {
  useEffect(() => {
    // Validate environment variables on client side
    validateEnv();
  }, []);

  return (
    <Provider>
      {children}
    </Provider>
  );
}
