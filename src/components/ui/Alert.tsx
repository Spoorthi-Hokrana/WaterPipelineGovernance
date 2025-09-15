import { ReactNode } from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string | ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ 
  type, 
  title, 
  message, 
  dismissible = false, 
  onDismiss, 
  className = "" 
}: AlertProps) {
  const baseClasses = "rounded-lg p-4 border";
  
  const typeClasses = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
  };

  const iconMap = {
    success: "✅",
    error: "❌", 
    warning: "⚠️",
    info: "ℹ️"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{iconMap[type]}</span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <div className={title ? "text-sm" : ""}>
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>
        </div>
        
        {dismissible && onDismiss && (
          <div className="ml-4">
            <button
              onClick={onDismiss}
              className="inline-flex text-lg hover:opacity-75 transition-opacity"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TransactionAlert({ 
  status, 
  txHash, 
  onDismiss 
}: { 
  status: "pending" | "success" | "error";
  txHash?: string;
  onDismiss?: () => void;
}) {
  const getContent = () => {
    switch (status) {
      case "pending":
        return {
          type: "info" as const,
          title: "Transaction Pending",
          message: (
            <div className="space-y-2">
              <p>Your transaction has been submitted to the blockchain.</p>
              {txHash && (
                <p className="text-xs font-mono break-all">
                  TX: {txHash}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Waiting for confirmation...</span>
              </div>
            </div>
          )
        };
      case "success":
        return {
          type: "success" as const,
          title: "Transaction Successful",
          message: (
            <div className="space-y-2">
              <p>Your transaction has been confirmed on the blockchain.</p>
              {txHash && (
                <p className="text-xs font-mono break-all">
                  TX: {txHash}
                </p>
              )}
            </div>
          )
        };
      case "error":
        return {
          type: "error" as const,
          title: "Transaction Failed",
          message: "Your transaction failed. Please try again or check your wallet for details."
        };
    }
  };

  const content = getContent();

  return (
    <Alert
      type={content.type}
      title={content.title}
      message={content.message}
      dismissible={status !== "pending"}
      onDismiss={onDismiss}
    />
  );
}
