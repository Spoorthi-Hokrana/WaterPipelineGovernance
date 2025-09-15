#!/usr/bin/env node

/**
 * Deployment Testing Script for Water Pipeline Governance
 * Tests live deployment functionality and reports results
 */

const https = require('https');
const http = require('http');

console.log('🧪 Water Pipeline Governance - Deployment Testing\n');

let testResults = [];
let hasErrors = false;

// Test configuration
const TEST_CONFIG = {
  timeout: 10000,
  retries: 3,
  expectedStatusCodes: [200, 301, 302],
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: TEST_CONFIG.timeout,
      ...options
    };

    const req = client.get(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Add test result
function addResult(test, status, message, details = null) {
  const result = {
    test,
    status,
    message,
    details,
    timestamp: new Date().toISOString()
  };
  
  testResults.push(result);
  
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${test}: ${message}`);
  
  if (details && process.env.VERBOSE) {
    console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
  }
  
  if (status === 'fail') {
    hasErrors = true;
  }
}

// Test basic connectivity
async function testBasicConnectivity(baseUrl) {
  console.log('🌐 Testing Basic Connectivity...\n');
  
  try {
    const response = await makeRequest(baseUrl);
    
    if (TEST_CONFIG.expectedStatusCodes.includes(response.statusCode)) {
      addResult(
        'Basic Connectivity',
        'pass',
        `Site accessible (${response.statusCode})`,
        { statusCode: response.statusCode, url: baseUrl }
      );
    } else {
      addResult(
        'Basic Connectivity',
        'fail',
        `Unexpected status code: ${response.statusCode}`,
        { statusCode: response.statusCode, url: baseUrl }
      );
    }
  } catch (error) {
    addResult(
      'Basic Connectivity',
      'fail',
      `Connection failed: ${error.message}`,
      { error: error.message, url: baseUrl }
    );
  }
}

// Test health endpoint
async function testHealthEndpoint(baseUrl) {
  console.log('\n💊 Testing Health Endpoint...\n');
  
  const healthUrl = `${baseUrl}/api/health`;
  
  try {
    const response = await makeRequest(healthUrl);
    
    if (response.statusCode === 200) {
      try {
        const healthData = JSON.parse(response.data);
        
        addResult(
          'Health Endpoint',
          'pass',
          'Health endpoint accessible',
          { url: healthUrl }
        );
        
        // Check health status
        if (healthData.status === 'healthy') {
          addResult(
            'Health Status',
            'pass',
            'Application status is healthy',
            { status: healthData.status }
          );
        } else {
          addResult(
            'Health Status',
            'fail',
            `Application status: ${healthData.status}`,
            { status: healthData.status, warnings: healthData.warnings }
          );
        }
        
        // Check environment variables
        if (healthData.config) {
          const config = healthData.config;
          
          if (config.hasThirdwebClientId) {
            addResult(
              'Thirdweb Client ID',
              'pass',
              'Thirdweb Client ID configured'
            );
          } else {
            addResult(
              'Thirdweb Client ID',
              'fail',
              'Thirdweb Client ID missing'
            );
          }
          
          if (config.hasContractAddress) {
            addResult(
              'Contract Address',
              'pass',
              'Contract address configured'
            );
          } else {
            addResult(
              'Contract Address',
              'fail',
              'Contract address missing'
            );
          }
          
          if (config.defaultChainId === '1287') {
            addResult(
              'Network Configuration',
              'pass',
              'Configured for Moonbase Alpha (1287)'
            );
          } else {
            addResult(
              'Network Configuration',
              'warn',
              `Network: ${config.defaultChainId} (not Moonbase Alpha)`
            );
          }
        }
        
      } catch (parseError) {
        addResult(
          'Health Endpoint',
          'fail',
          'Invalid JSON response from health endpoint',
          { error: parseError.message }
        );
      }
    } else {
      addResult(
        'Health Endpoint',
        'fail',
        `Health endpoint returned ${response.statusCode}`,
        { statusCode: response.statusCode, url: healthUrl }
      );
    }
  } catch (error) {
    addResult(
      'Health Endpoint',
      'fail',
      `Health check failed: ${error.message}`,
      { error: error.message, url: healthUrl }
    );
  }
}

// Test critical pages
async function testCriticalPages(baseUrl) {
  console.log('\n📄 Testing Critical Pages...\n');
  
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/proposals', name: 'Proposals Page' },
    { path: '/voting', name: 'Voting Page' },
    { path: '/milestones', name: 'Milestones Page' },
    { path: '/admin', name: 'Admin Page' }
  ];
  
  for (const page of pages) {
    const pageUrl = `${baseUrl}${page.path}`;
    
    try {
      const response = await makeRequest(pageUrl);
      
      if (TEST_CONFIG.expectedStatusCodes.includes(response.statusCode)) {
        // Basic check for React content
        if (response.data.includes('__NEXT_DATA__') || response.data.includes('React')) {
          addResult(
            page.name,
            'pass',
            `Page loads successfully (${response.statusCode})`,
            { url: pageUrl }
          );
        } else {
          addResult(
            page.name,
            'warn',
            'Page loads but may not be React app',
            { url: pageUrl, statusCode: response.statusCode }
          );
        }
      } else {
        addResult(
          page.name,
          'fail',
          `Page returned ${response.statusCode}`,
          { url: pageUrl, statusCode: response.statusCode }
        );
      }
    } catch (error) {
      addResult(
        page.name,
        'fail',
        `Page failed to load: ${error.message}`,
        { url: pageUrl, error: error.message }
      );
    }
  }
}

// Test security headers
async function testSecurityHeaders(baseUrl) {
  console.log('\n🔒 Testing Security Headers...\n');
  
  try {
    const response = await makeRequest(baseUrl);
    const headers = response.headers;
    
    const securityHeaders = [
      { name: 'x-content-type-options', expected: 'nosniff' },
      { name: 'x-frame-options', expected: 'DENY' },
      { name: 'x-xss-protection', expected: '1; mode=block' },
      { name: 'strict-transport-security', required: false }
    ];
    
    securityHeaders.forEach(header => {
      const headerValue = headers[header.name];
      
      if (headerValue) {
        if (header.expected && headerValue.includes(header.expected)) {
          addResult(
            `Security Header: ${header.name}`,
            'pass',
            `Correctly set: ${headerValue}`
          );
        } else {
          addResult(
            `Security Header: ${header.name}`,
            'pass',
            `Present: ${headerValue}`
          );
        }
      } else {
        const status = header.required === false ? 'warn' : 'fail';
        addResult(
          `Security Header: ${header.name}`,
          status,
          'Header not present'
        );
      }
    });
    
  } catch (error) {
    addResult(
      'Security Headers',
      'fail',
      `Failed to check headers: ${error.message}`
    );
  }
}

// Test performance basics
async function testPerformance(baseUrl) {
  console.log('\n⚡ Testing Basic Performance...\n');
  
  const startTime = Date.now();
  
  try {
    const response = await makeRequest(baseUrl);
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      addResult(
        'Page Load Time',
        'pass',
        `Fast loading: ${loadTime}ms`,
        { loadTime }
      );
    } else if (loadTime < 5000) {
      addResult(
        'Page Load Time',
        'warn',
        `Moderate loading: ${loadTime}ms`,
        { loadTime }
      );
    } else {
      addResult(
        'Page Load Time',
        'fail',
        `Slow loading: ${loadTime}ms`,
        { loadTime }
      );
    }
    
    // Check response size
    const responseSize = Buffer.byteLength(response.data, 'utf8');
    const sizeKB = Math.round(responseSize / 1024);
    
    if (sizeKB < 500) {
      addResult(
        'Response Size',
        'pass',
        `Optimal size: ${sizeKB}KB`,
        { sizeKB }
      );
    } else if (sizeKB < 1000) {
      addResult(
        'Response Size',
        'warn',
        `Large size: ${sizeKB}KB`,
        { sizeKB }
      );
    } else {
      addResult(
        'Response Size',
        'fail',
        `Very large size: ${sizeKB}KB`,
        { sizeKB }
      );
    }
    
  } catch (error) {
    addResult(
      'Performance Test',
      'fail',
      `Performance test failed: ${error.message}`
    );
  }
}

// Generate summary report
function generateSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 DEPLOYMENT TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = testResults.filter(r => r.status === 'pass').length;
  const failed = testResults.filter(r => r.status === 'fail').length;
  const warnings = testResults.filter(r => r.status === 'warn').length;
  const total = testResults.length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`📊 Total Tests: ${total}`);
  
  const successRate = Math.round((passed / total) * 100);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your deployment is ready for production.');
  } else if (failed <= 2) {
    console.log('\n⚠️  Minor issues found. Review failed tests above.');
  } else {
    console.log('\n❌ Major issues found. Please fix critical errors before going live.');
  }
  
  console.log('\n📋 Recommendations:');
  if (failed > 0) {
    console.log('   - Fix all failed tests before production use');
  }
  if (warnings > 0) {
    console.log('   - Address warnings for better performance');
  }
  console.log('   - Test with real users on different devices');
  console.log('   - Monitor performance after going live');
  console.log('   - Set up error tracking and analytics');
  
  console.log('\n📖 For detailed troubleshooting, see:');
  console.log('   - ENVIRONMENT_SETUP.md');
  console.log('   - DEPLOYMENT_GUIDE.md');
  console.log('   - VERCEL_ENV_SETUP.md');
}

// Main test runner
async function runTests() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('❌ Error: Please provide your deployment URL');
    console.error('Usage: node scripts/test-deployment.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  console.log(`🎯 Testing deployment: ${baseUrl}\n`);
  
  try {
    await testBasicConnectivity(baseUrl);
    await testHealthEndpoint(baseUrl);
    await testCriticalPages(baseUrl);
    await testSecurityHeaders(baseUrl);
    await testPerformance(baseUrl);
    
    generateSummary();
    
    // Export results for CI/CD
    if (process.env.CI) {
      require('fs').writeFileSync(
        'test-results.json', 
        JSON.stringify(testResults, null, 2)
      );
    }
    
    process.exit(hasErrors ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Fatal error during testing:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testResults };
