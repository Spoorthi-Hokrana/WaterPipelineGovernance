"use client";

import { useState } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { useGovernanceContract } from "@/hooks/contract";
import { getChainInfo } from "@/lib/thirdweb";
import { useLogger } from "@/utils/debug/logger";

interface TestResult {
  test: string;
  status: "pass" | "fail" | "running";
  message: string;
  details?: any;
}

export function QuickTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const { admin, proposalCount, isAdmin } = useGovernanceContract();
  const log = useLogger("QuickTest");

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
    log.info(`Test: ${result.test}`, { status: result.status, message: result.message });
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    log.info("Starting quick tests");

    // Test 1: Wallet Connection
    addResult({
      test: "Wallet Connection",
      status: "running", 
      message: "Checking wallet connection..."
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    if (account) {
      addResult({
        test: "Wallet Connection",
        status: "pass",
        message: `Connected: ${account.address}`,
        details: { address: account.address }
      });
    } else {
      addResult({
        test: "Wallet Connection", 
        status: "fail",
        message: "No wallet connected"
      });
    }

    // Test 2: Network Check
    addResult({
      test: "Network Check",
      status: "running",
      message: "Verifying network..."
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    if (chain) {
      const chainInfo = getChainInfo(chain.id);
      if (chain.id === 1287) {
        addResult({
          test: "Network Check",
          status: "pass", 
          message: `Connected to ${chainInfo.name}`,
          details: { chainId: chain.id, chainName: chainInfo.name }
        });
      } else {
        addResult({
          test: "Network Check",
          status: "fail",
          message: `Wrong network: ${chainInfo.name}. Expected Moonbase Alpha.`,
          details: { chainId: chain.id, expected: 1287 }
        });
      }
    } else {
      addResult({
        test: "Network Check",
        status: "fail",
        message: "No network detected"
      });
    }

    // Test 3: Contract Connection
    addResult({
      test: "Contract Connection",
      status: "running",
      message: "Checking contract..."
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (admin) {
      addResult({
        test: "Contract Connection",
        status: "pass",
        message: `Contract loaded. Admin: ${admin}`,
        details: { admin, proposalCount: Number(proposalCount) }
      });
    } else {
      addResult({
        test: "Contract Connection", 
        status: "fail",
        message: "Contract not accessible"
      });
    }

    // Test 4: Admin Status
    if (account) {
      addResult({
        test: "Admin Status",
        status: "running",
        message: "Checking admin privileges..."
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const hasAdminAccess = isAdmin(account.address);
      addResult({
        test: "Admin Status",
        status: hasAdminAccess ? "pass" : "fail",
        message: hasAdminAccess ? "Admin access confirmed" : "No admin access",
        details: { hasAdminAccess, userAddress: account.address, adminAddress: admin }
      });
    }

    // Test 5: Basic Functionality
    addResult({
      test: "Basic Functionality",
      status: "running", 
      message: "Testing basic features..."
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Test basic read operations
      const testsPassed = [
        admin !== undefined,
        proposalCount !== undefined,
        chain !== undefined
      ].filter(Boolean).length;

      addResult({
        test: "Basic Functionality",
        status: testsPassed >= 2 ? "pass" : "fail",
        message: `${testsPassed}/3 basic checks passed`,
        details: { testsPassed }
      });
    } catch (error) {
      addResult({
        test: "Basic Functionality",
        status: "fail",
        message: "Error during basic functionality test",
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }

    setIsRunning(false);
    log.info("Quick tests completed", { 
      totalTests: results.length,
      passed: results.filter(r => r.status === "pass").length
    });
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass": return "✅";
      case "fail": return "❌"; 
      case "running": return "⏳";
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass": return "text-green-600 dark:text-green-400";
      case "fail": return "text-red-600 dark:text-red-400";
      case "running": return "text-yellow-600 dark:text-yellow-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🧪 Quick System Test
        </h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
        >
          {isRunning ? "Running..." : "Run Tests"}
        </button>
      </div>

      <div className="space-y-3">
        {results.length === 0 && !isRunning && (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Click "Run Tests" to verify system functionality
          </p>
        )}

        {results.map((result, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <span className="text-xl">{getStatusIcon(result.status)}</span>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-900 dark:text-white">
                  {result.test}
                </span>
                <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {result.message}
              </p>
              {result.details && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Show details
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Summary:</strong>{" "}
            {results.filter(r => r.status === "pass").length} passed, {" "}
            {results.filter(r => r.status === "fail").length} failed out of {results.length} tests
          </div>
        </div>
      )}
    </div>
  );
}
