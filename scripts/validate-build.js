#!/usr/bin/env node

/**
 * Build validation script for Water Pipeline Governance
 * Runs before deployment to ensure all requirements are met
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build requirements...\n');

let hasErrors = false;
const warnings = [];

// Check environment variables
function checkEnvironmentVariables() {
  console.log('📝 Checking environment variables...');
  
  const required = [
    'NEXT_PUBLIC_THIRDWEB_CLIENT_ID',
    'NEXT_PUBLIC_CONTRACT_ADDRESS'
  ];
  
  const optional = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_DEFAULT_CHAIN_ID'
  ];
  
  const missing = required.filter(env => !process.env[env]);
  const missingOptional = optional.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(env => console.error(`   - ${env}`));
    hasErrors = true;
  } else {
    console.log('✅ All required environment variables present');
  }
  
  if (missingOptional.length > 0) {
    console.log('⚠️  Missing optional environment variables:');
    missingOptional.forEach(env => console.log(`   - ${env}`));
    warnings.push(`Missing optional env vars: ${missingOptional.join(', ')}`);
  }
  
  console.log();
}

// Check required files
function checkRequiredFiles() {
  console.log('📁 Checking required files...');
  
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'vercel.json',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'tailwind.config.ts'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const filePath = path.join(process.cwd(), file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    hasErrors = true;
  } else {
    console.log('✅ All required files present');
  }
  
  console.log();
}

// Check package.json
function checkPackageJson() {
  console.log('📦 Checking package.json...');
  
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'thirdweb',
      'ethers'
    ];
    
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );
    
    if (missingDeps.length > 0) {
      console.error('❌ Missing required dependencies:');
      missingDeps.forEach(dep => console.error(`   - ${dep}`));
      hasErrors = true;
    } else {
      console.log('✅ All required dependencies present');
    }
    
    // Check scripts
    const requiredScripts = ['build', 'start'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      console.error('❌ Missing required scripts:');
      missingScripts.forEach(script => console.error(`   - ${script}`));
      hasErrors = true;
    } else {
      console.log('✅ All required scripts present');
    }
    
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    hasErrors = true;
  }
  
  console.log();
}

// Check smart contract configuration
function checkContractConfig() {
  console.log('🔗 Checking smart contract configuration...');
  
  try {
    const configPath = path.join(process.cwd(), 'src/lib/contract/config.ts');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ Contract configuration file not found');
      hasErrors = true;
      return;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for essential contract configuration
    const requiredExports = [
      'waterPipelineContract',
      'ProposalStatus',
      'VoterType'
    ];
    
    const missingExports = requiredExports.filter(exp => 
      !configContent.includes(`export`) || !configContent.includes(exp)
    );
    
    if (missingExports.length > 0) {
      console.error('❌ Missing contract configuration exports:');
      missingExports.forEach(exp => console.error(`   - ${exp}`));
      hasErrors = true;
    } else {
      console.log('✅ Contract configuration appears valid');
    }
    
  } catch (error) {
    console.error('❌ Error checking contract configuration:', error.message);
    hasErrors = true;
  }
  
  console.log();
}

// Validate contract address format
function validateContractAddress() {
  console.log('📄 Validating contract address...');
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.log('⚠️  Contract address not set (will be validated at runtime)');
    return;
  }
  
  // Basic Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  
  if (!ethAddressRegex.test(contractAddress)) {
    console.error('❌ Invalid contract address format:', contractAddress);
    console.error('   Expected format: 0x followed by 40 hexadecimal characters');
    hasErrors = true;
  } else {
    console.log('✅ Contract address format is valid');
  }
  
  console.log();
}

// Check Vercel configuration
function checkVercelConfig() {
  console.log('⚡ Checking Vercel configuration...');
  
  try {
    const vercelPath = path.join(process.cwd(), 'vercel.json');
    
    if (!fs.existsSync(vercelPath)) {
      console.log('⚠️  vercel.json not found (using defaults)');
      warnings.push('No vercel.json configuration file');
      return;
    }
    
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    
    // Check essential configuration
    if (!vercelConfig.buildCommand) {
      warnings.push('No build command specified in vercel.json');
    }
    
    if (!vercelConfig.framework || vercelConfig.framework !== 'nextjs') {
      warnings.push('Framework not set to nextjs in vercel.json');
    }
    
    console.log('✅ Vercel configuration found');
    
  } catch (error) {
    console.error('❌ Error reading vercel.json:', error.message);
    hasErrors = true;
  }
  
  console.log();
}

// Run all checks
function runValidation() {
  console.log('🚀 Water Pipeline Governance - Build Validation\n');
  
  checkEnvironmentVariables();
  checkRequiredFiles();
  checkPackageJson();
  checkContractConfig();
  validateContractAddress();
  checkVercelConfig();
  
  // Summary
  console.log('📊 Validation Summary:');
  console.log('='.repeat(50));
  
  if (hasErrors) {
    console.error('❌ Validation FAILED - Please fix the errors above');
    process.exit(1);
  } else {
    console.log('✅ Validation PASSED - Ready for deployment');
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    
    console.log('\n🎉 Your Water Pipeline Governance platform is ready for Vercel deployment!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runValidation();
}

module.exports = { runValidation };
