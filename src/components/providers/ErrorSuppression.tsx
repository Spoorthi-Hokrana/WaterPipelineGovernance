"use client";

import { useEffect } from "react";
import { suppressThirdwebAnalyticsErrors } from "@/utils/suppressErrors";

/**
 * Client component to suppress harmless errors
 * - Thirdweb analytics errors (401 from telemetry)
 * - Talisman wallet errors (Polkadot wallet, not compatible with EVM)
 * 
 * This prevents these harmless errors from cluttering the console and error overlay
 */
export function ErrorSuppression() {
  useEffect(() => {
    // Run immediately on mount
    suppressThirdwebAnalyticsErrors();
    
    // Also run after a short delay to catch any errors that fire later
    const timeoutId = setTimeout(() => {
      suppressThirdwebAnalyticsErrors();
    }, 100);
    
    // Run again when window is fully loaded
    if (typeof window !== 'undefined') {
      const handleLoad = () => {
        suppressThirdwebAnalyticsErrors();
      };
      
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
      }
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('load', handleLoad);
      };
    }
    
    return () => clearTimeout(timeoutId);
  }, []);

  return null; // This component doesn't render anything
}
