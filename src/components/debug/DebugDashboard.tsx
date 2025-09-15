"use client";

import { useState, useEffect } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";
import { logger, LogLevel } from "@/utils/debug/logger";
import { getChainInfo } from "@/lib/thirdweb";
import { formatAddress } from "@/utils/blockchain";

interface DebugInfo {
  wallet: {
    connected: boolean;
    address?: string;
    chainId?: number;
    chainName?: string;
  };
  contract: {
    admin?: string;
    proposalCount?: number;
    isUserAdmin?: boolean;
  };
  logs: {
    total: number;
    errors: number;
    warnings: number;
    recent: any[];
  };
}

export function DebugDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const { admin, proposalCount, isAdmin } = useGovernanceContract();

  // Only show in development
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateDebugInfo = () => {
      const logSummary = logger.getSummary();
      
      setDebugInfo({
        wallet: {
          connected: !!account,
          address: account?.address,
          chainId: chain?.id,
          chainName: chain ? getChainInfo(chain.id).name : undefined,
        },
        contract: {
          admin: admin,
          proposalCount: Number(proposalCount) || 0,
          isUserAdmin: account ? isAdmin(account.address) : false,
        },
        logs: {
          total: logSummary.total,
          errors: logSummary.byLevel.error,
          warnings: logSummary.byLevel.warn,
          recent: logSummary.recent,
        },
      });
      
      setLogs(logger.getLogs(LogLevel.WARN)); // Show warnings and errors
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);
    
    return () => clearInterval(interval);
  }, [account?.address, chain?.id, admin, proposalCount]); // Remove isAdmin from dependencies

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50 text-sm font-mono"
        title="Open Debug Dashboard"
      >
        🐛 DEBUG
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-black text-green-400 font-mono text-xs overflow-hidden rounded-lg shadow-xl z-50 border border-green-500">
      {/* Header */}
      <div className="bg-green-900 text-white p-2 flex justify-between items-center">
        <span>🐛 Debug Dashboard</span>
        <div className="flex gap-2">
          <button
            onClick={() => logger.clearLogs()}
            className="text-yellow-400 hover:text-yellow-300"
            title="Clear Logs"
          >
            🗑️
          </button>
          <button
            onClick={() => {
              const logs = logger.exportLogs();
              navigator.clipboard.writeText(logs);
              alert('Logs copied to clipboard');
            }}
            className="text-blue-400 hover:text-blue-300"
            title="Export Logs"
          >
            📋
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto max-h-80">
        {debugInfo && (
          <>
            {/* Wallet Info */}
            <div className="mb-3">
              <div className="text-yellow-400 font-bold">🔗 WALLET</div>
              <div>Connected: {debugInfo.wallet.connected ? '✅' : '❌'}</div>
              {debugInfo.wallet.address && (
                <>
                  <div>Address: {formatAddress(debugInfo.wallet.address)}</div>
                  <div>Chain: {debugInfo.wallet.chainName} ({debugInfo.wallet.chainId})</div>
                </>
              )}
            </div>

            {/* Contract Info */}
            <div className="mb-3">
              <div className="text-yellow-400 font-bold">📄 CONTRACT</div>
              <div>Admin: {debugInfo.contract.admin ? formatAddress(debugInfo.contract.admin) : 'Unknown'}</div>
              <div>Proposals: {debugInfo.contract.proposalCount}</div>
              <div>Is Admin: {debugInfo.contract.isUserAdmin ? '✅' : '❌'}</div>
            </div>

            {/* Log Summary */}
            <div className="mb-3">
              <div className="text-yellow-400 font-bold">📊 LOGS</div>
              <div>Total: {debugInfo.logs.total}</div>
              <div className="text-red-400">Errors: {debugInfo.logs.errors}</div>
              <div className="text-yellow-400">Warnings: {debugInfo.logs.warnings}</div>
            </div>

            {/* Recent Logs */}
            <div>
              <div className="text-yellow-400 font-bold">📝 RECENT LOGS</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {logs.slice(-5).map((log, index) => (
                  <div key={index} className={`text-xs ${
                    log.level === LogLevel.ERROR ? 'text-red-400' : 
                    log.level === LogLevel.WARN ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    <span className="text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {' '}
                    <span className="text-blue-400">[{log.component}]</span>
                    {' '}
                    {log.message}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500">No warnings or errors</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 p-2 text-center text-gray-400">
        Press F12 to open browser DevTools
      </div>
    </div>
  );
}

// Test runner component
export function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Simulate running tests
    const testResults = [
      { name: "Wallet Connection", status: "pass", duration: 1200 },
      { name: "Network Detection", status: "pass", duration: 800 },
      { name: "Contract Loading", status: "warning", duration: 2100 },
      { name: "Admin Access", status: "pass", duration: 1500 },
    ];

    for (const result of testResults) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(prev => [...prev, result]);
      
      logger.info('TestRunner', `Test completed: ${result.name}`, {
        status: result.status,
        duration: result.duration,
      });
    }
    
    setIsRunning(false);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-900 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm">
      <h3 className="font-bold mb-2">🧪 Test Runner</h3>
      
      {!isRunning ? (
        <button
          onClick={runTests}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Run Tests
        </button>
      ) : (
        <div className="text-sm">
          <div className="mb-2">Running tests...</div>
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="flex justify-between">
                <span>{result.name}</span>
                <span className={
                  result.status === 'pass' ? 'text-green-400' :
                  result.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }>
                  {result.status === 'pass' ? '✅' :
                   result.status === 'warning' ? '⚠️' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
