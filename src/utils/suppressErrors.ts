/**
 * Suppress harmless thirdweb analytics errors and Talisman wallet errors from console
 * These errors don't affect functionality and are safe to ignore
 * 
 * Talisman is a Polkadot wallet that's not compatible with EVM chains
 * Thirdweb analytics 401 errors are from optional telemetry
 */

export function suppressThirdwebAnalyticsErrors() {
  if (typeof window === 'undefined') return;
  
  // Store original error handlers
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Override console.error to filter out harmless errors
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ').toLowerCase();
    const errorString = String(args[0] || '').toLowerCase();
    
    // Filter out harmless errors
    const shouldSuppress = 
      // Thirdweb analytics errors
      errorMessage.includes('thirdweb.com/event') ||
      errorMessage.includes('thirdweb.com/v1/profiles') ||
      errorMessage.includes('social.thirdweb.com') ||
      (errorMessage.includes('401') && errorMessage.includes('thirdweb')) ||
      // Talisman wallet errors (Polkadot wallet, not compatible with EVM)
      errorMessage.includes('talisman extension has not been configured') ||
      errorMessage.includes('talisman extension') ||
      errorMessage.includes('chrome-extension://fijngjgcjhjmmpcmkeiomlglpeiijkld') ||
      errorMessage.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') ||
      errorMessage.includes('continue with onboarding') ||
      errorString.includes('talisman') ||
      errorString.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld');
    
    if (shouldSuppress) {
      // Silently ignore - these are harmless errors
      return;
    }
    
    // For all other errors, use original console.error
    originalConsoleError.apply(console, args);
  };
  
  // Override console.warn as well (some errors might come through as warnings)
  console.warn = (...args: any[]) => {
    const warningMessage = args.join(' ').toLowerCase();
    const warningString = String(args[0] || '').toLowerCase();
    
    const shouldSuppress = 
      warningMessage.includes('talisman') ||
      warningMessage.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') ||
      warningString.includes('talisman') ||
      warningString.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld');
    
    if (shouldSuppress) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  // Suppress unhandled promise rejections from Talisman
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = String(event.reason || '').toLowerCase();
    const errorStack = String(event.reason?.stack || '').toLowerCase();
    
    if (
      errorMessage.includes('talisman') ||
      errorMessage.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') ||
      errorMessage.includes('extension has not been configured') ||
      errorStack.includes('talisman') ||
      errorStack.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld')
    ) {
      event.preventDefault(); // Prevent the error from showing
      return;
    }
  }, true); // Use capture phase to catch early
  
  // Suppress error events from Talisman extension
  window.addEventListener('error', (event) => {
    const errorMessage = String(event.message || '').toLowerCase();
    const errorSource = String(event.filename || '').toLowerCase();
    
    if (
      errorMessage.includes('talisman') ||
      errorMessage.includes('extension has not been configured') ||
      errorMessage.includes('continue with onboarding') ||
      errorMessage.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld') ||
      errorSource.includes('fijngjgcjhjmmpcmkeiomlglpeiijkld')
    ) {
      event.preventDefault(); // Prevent the error from propagating
      return false;
    }
  }, true); // Use capture phase to catch early
  
  // Also filter fetch errors for thirdweb analytics
  const originalFetch = window.fetch;
  window.fetch = async function(...args: any[]) {
    const url = args[0]?.toString() || '';
    
    // Suppress errors from thirdweb analytics endpoints
    if (url.includes('thirdweb.com/event') || url.includes('social.thirdweb.com')) {
      try {
        const response = await originalFetch.apply(window, args);
        // Don't log 401 errors from analytics
        if (response.status === 401 && url.includes('thirdweb.com')) {
          // Silently ignore - this is just analytics
          return response;
        }
        return response;
      } catch (error) {
        // Suppress network errors from analytics endpoints
        if (url.includes('thirdweb.com')) {
          // Return a mock response to prevent error bubbling
          return new Response(null, { status: 401 });
        }
        throw error;
      }
    }
    
    return originalFetch.apply(window, args);
  };
}

// Auto-initialize on import (client-side only) - this runs immediately
if (typeof window !== 'undefined') {
  // Run immediately and also on DOMContentLoaded to catch early errors
  suppressThirdwebAnalyticsErrors();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      suppressThirdwebAnalyticsErrors();
    });
  }
}
