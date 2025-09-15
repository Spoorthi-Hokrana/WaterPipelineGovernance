#!/usr/bin/env node

/**
 * Interactive Environment Setup Script
 * Helps users configure environment variables for deployment
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Water Pipeline Governance - Environment Setup\n');
console.log('This script will help you set up environment variables for your deployment.\n');

const envVars = {};

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function validateEthereumAddress(address) {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

function validateClientId(clientId) {
  // Basic validation - should be a non-empty string
  return clientId && clientId.length > 10;
}

async function collectEnvironmentVariables() {
  console.log('📝 Please provide the following information:\n');
  
  // Thirdweb Client ID
  while (true) {
    const clientId = await askQuestion(
      '🔑 Thirdweb Client ID (get from https://thirdweb.com/dashboard): '
    );
    
    if (validateClientId(clientId)) {
      envVars.NEXT_PUBLIC_THIRDWEB_CLIENT_ID = clientId;
      break;
    } else {
      console.log('❌ Invalid Client ID. Please check and try again.\n');
    }
  }
  
  // Contract Address
  while (true) {
    const contractAddress = await askQuestion(
      '📄 Smart Contract Address (0x...): '
    );
    
    if (validateEthereumAddress(contractAddress)) {
      envVars.NEXT_PUBLIC_CONTRACT_ADDRESS = contractAddress;
      break;
    } else {
      console.log('❌ Invalid Ethereum address format. Should be 0x followed by 40 hex characters.\n');
    }
  }
  
  // App Name (optional)
  const appName = await askQuestion(
    '📱 App Name (default: Water Pipeline Governance): '
  );
  envVars.NEXT_PUBLIC_APP_NAME = appName || 'Water Pipeline Governance';
  
  // Network (optional)
  console.log('\n🌐 Select Network:');
  console.log('1. Moonbase Alpha (1287) - Recommended for testing');
  console.log('2. Moonbeam Mainnet (1284)');
  console.log('3. Ethereum Mainnet (1)');
  console.log('4. Polygon Mainnet (137)');
  
  const networkChoice = await askQuestion('Choose network (1-4, default: 1): ');
  
  const networks = {
    '1': '1287',  // Moonbase Alpha
    '2': '1284',  // Moonbeam
    '3': '1',     // Ethereum
    '4': '137'    // Polygon
  };
  
  envVars.NEXT_PUBLIC_DEFAULT_CHAIN_ID = networks[networkChoice] || '1287';
}

function generateEnvFile() {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envFilePath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envFilePath, envContent + '\n');
    console.log(`✅ Created ${envFilePath}`);
  } catch (error) {
    console.error(`❌ Failed to create ${envFilePath}:`, error.message);
  }
}

function generateVercelCommands() {
  console.log('\n📋 Vercel CLI Commands (run these to set environment variables):');
  console.log('=' .repeat(70));
  
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`vercel env add ${key}`);
    console.log(`# Enter when prompted: ${value}`);
    console.log('');
  });
  
  console.log('Then deploy with: vercel --prod');
}

function generateVercelDashboardInstructions() {
  console.log('\n🌐 Vercel Dashboard Setup:');
  console.log('=' .repeat(40));
  console.log('1. Go to https://vercel.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings → Environment Variables');
  console.log('4. Add these variables:\n');
  
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`Name: ${key}`);
    console.log(`Value: ${value}`);
    console.log(`Environments: ✓ Production ✓ Preview ✓ Development\n`);
  });
}

function displaySummary() {
  console.log('\n🎉 Environment Setup Complete!');
  console.log('=' .repeat(40));
  
  console.log('\n📊 Configuration Summary:');
  Object.entries(envVars).forEach(([key, value]) => {
    const displayValue = key.includes('CLIENT_ID') ? 
      value.substring(0, 8) + '...' : value;
    console.log(`✅ ${key}: ${displayValue}`);
  });
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Review the generated .env.local file');
  console.log('2. Test locally: npm run dev');
  console.log('3. Set up Vercel environment variables (see instructions above)');
  console.log('4. Deploy: npm run deploy');
  console.log('5. Test deployment: npm run test:deployment https://your-app.vercel.app');
  
  console.log('\n📚 Documentation:');
  console.log('- ENVIRONMENT_SETUP.md - Detailed setup guide');
  console.log('- DEPLOYMENT_GUIDE.md - Complete deployment instructions');
  console.log('- VERCEL_ENV_SETUP.md - Environment variable reference');
}

async function main() {
  try {
    await collectEnvironmentVariables();
    
    console.log('\n📁 Generating configuration files...\n');
    
    generateEnvFile();
    generateVercelCommands();
    generateVercelDashboardInstructions();
    displaySummary();
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled by user.');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
