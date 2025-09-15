# 🔑 Environment Variables & Testing Guide

This guide will help you set up environment variables and test your deployed Water Pipeline Governance platform.

## 📋 **Step 1: Get Required Keys**

### 🔗 **Thirdweb Client ID**

1. **Visit Thirdweb Dashboard**: [https://thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. **Sign In/Create Account**: Connect your wallet
3. **Create New Project**: 
   - Click "Create Project"
   - Name: "Water Pipeline Governance"
   - Description: "Decentralized governance for water pipeline management"
4. **Copy Client ID**: From project settings → API Keys

### 📄 **Deploy Smart Contract**

You have two options for deploying your contract:

#### Option A: Using Remix IDE (Recommended)
1. **Open Remix**: [https://remix.ethereum.org](https://remix.ethereum.org)
2. **Create New File**: `WaterPipelineGovernance.sol`
3. **Copy Contract Code**: From `contracts/contract.sol`
4. **Compile Contract**: Solidity Compiler → Select version 0.8.17+ → Compile
5. **Deploy to Moonbase Alpha**:
   - Environment: "Injected Provider - MetaMask"
   - Network: Switch MetaMask to Moonbase Alpha
   - Contract: WaterPipelineGovernance
   - Click "Deploy"
6. **Copy Contract Address**: From deployment transaction

#### Option B: Using Thirdweb Deploy
1. **Install Thirdweb CLI**: 
   ```bash
   npm install -g @thirdweb-dev/cli
   ```
2. **Deploy Contract**:
   ```bash
   npx thirdweb deploy contracts/contract.sol
   ```
3. **Follow Web Interface**: Complete deployment on Moonbase Alpha
4. **Copy Contract Address**: From deployment confirmation

### 🌙 **Add Moonbase Alpha to MetaMask**

```
Network Name: Moonbase Alpha
RPC URL: https://rpc.api.moonbase.moonbeam.network
Chain ID: 1287
Currency Symbol: DEV
Block Explorer: https://moonbase.moonscan.io
```

### 💰 **Get Test Tokens**

1. **Visit Faucet**: [https://apps.moonbeam.network/moonbase-alpha/faucet/](https://apps.moonbeam.network/moonbase-alpha/faucet/)
2. **Connect Wallet**: Use MetaMask
3. **Request DEV Tokens**: Click "Request 10 DEV"
4. **Wait for Confirmation**: Usually takes < 1 minute

## 🔧 **Step 2: Set Environment Variables**

### **Local Development (.env.local)**

Create `.env.local` file in your project root:

```env
# Get from https://thirdweb.com/dashboard
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id_here

# Your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourActualContractAddress

# App configuration
NEXT_PUBLIC_APP_NAME="Water Pipeline Governance"
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1287
```

### **Vercel Production Deployment**

#### Method 1: Vercel Dashboard
1. **Go to Project**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select Project**: Your water-pipeline-governance project
3. **Settings Tab**: Click Settings
4. **Environment Variables**: In left sidebar
5. **Add Variables**:

```
Name: NEXT_PUBLIC_THIRDWEB_CLIENT_ID
Value: [Your actual Thirdweb Client ID]
Environments: ✓ Production ✓ Preview ✓ Development

Name: NEXT_PUBLIC_CONTRACT_ADDRESS
Value: 0x[Your actual contract address]
Environments: ✓ Production ✓ Preview ✓ Development

Name: NEXT_PUBLIC_APP_NAME
Value: Water Pipeline Governance
Environments: ✓ Production ✓ Preview ✓ Development

Name: NEXT_PUBLIC_DEFAULT_CHAIN_ID
Value: 1287
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID
# Enter your client ID when prompted

vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
# Enter your contract address when prompted

vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Water Pipeline Governance

vercel env add NEXT_PUBLIC_DEFAULT_CHAIN_ID
# Enter: 1287
```

## 🚀 **Step 3: Deploy to Vercel**

### **Method 1: GitHub Integration (Recommended)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add environment configuration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure build settings (auto-detected)
   - Add environment variables (see Step 2)
   - Deploy

### **Method 2: Direct CLI Deployment**

```bash
# Build and validate locally first
npm run validate
npm run build

# Deploy to Vercel
vercel --prod

# Or for preview deployment
vercel
```

## 🧪 **Step 4: Test Your Deployment**

### **Automated Testing**

I'll create a comprehensive testing script for you:

```bash
# Run local validation
npm run validate

# Test production build locally
npm run build
npm start

# Check if all pages compile
npm run type-check
npm run lint
```

### **Manual Testing Checklist**

#### ✅ **Basic Functionality**
- [ ] Site loads without errors
- [ ] All pages accessible (/, /proposals, /voting, /milestones, /admin)
- [ ] Mobile responsive design works
- [ ] No console errors in browser

#### ✅ **Wallet Integration**
- [ ] Connect Wallet button appears
- [ ] MetaMask connection works
- [ ] Network detection works (shows Moonbase Alpha)
- [ ] Wrong network prompts switch
- [ ] Wallet address displays correctly

#### ✅ **Smart Contract Integration**
- [ ] Contract data loads (admin address, proposal count)
- [ ] Admin status detected correctly
- [ ] Read functions work (viewing proposals, voter status)
- [ ] Write functions work (if you're admin: register voter, create proposal)

#### ✅ **User Interface**
- [ ] Navigation works on all devices
- [ ] Forms validate input correctly
- [ ] Loading states show during transactions
- [ ] Success/error notifications appear
- [ ] Debug tools work (development only)

### **Health Check Endpoint**

Test your deployment health:

```bash
# Replace with your actual Vercel URL
curl https://your-app-name.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "config": {
    "hasThirdwebClientId": true,
    "hasContractAddress": true,
    "appName": "Water Pipeline Governance",
    "defaultChainId": "1287"
  }
}
```

## 🔍 **Step 5: Comprehensive Testing**

### **Test User Flows**

#### **As a Visitor**:
1. Visit your deployed site
2. Connect wallet to Moonbase Alpha
3. Browse proposals, voting, and milestones pages
4. Verify you can't perform admin actions

#### **As Admin** (if your wallet is the deployer):
1. Connect admin wallet
2. Access admin panel
3. Register a test voter (use another wallet address)
4. Create a test proposal
5. Verify proposal appears in proposals list

#### **As Registered Voter**:
1. Connect registered voter wallet
2. View active proposals
3. Cast a test vote
4. Verify vote is recorded

### **Performance Testing**

Check your deployment performance:

1. **Google PageSpeed Insights**: [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
   - Enter your Vercel URL
   - Check mobile and desktop scores

2. **GTmetrix**: [https://gtmetrix.com/](https://gtmetrix.com/)
   - Analyze loading performance
   - Check Core Web Vitals

3. **Lighthouse** (in Chrome DevTools):
   - Open your site
   - F12 → Lighthouse tab
   - Run audit

## 🚨 **Troubleshooting Common Issues**

### **Environment Variables Not Working**
```bash
# Check if variables are set correctly
vercel env ls

# Redeploy after adding variables
vercel --prod --force
```

### **Contract Connection Issues**
1. Verify contract address format (0x + 40 hex characters)
2. Check contract is deployed on Moonbase Alpha
3. Verify network ID matches (1287)
4. Confirm contract is verified on block explorer

### **Wallet Connection Problems**
1. Clear browser cache and reload
2. Reset MetaMask connection
3. Check if site is on HTTPS (required for Web3)
4. Verify Moonbase Alpha network is added to MetaMask

### **Build/Deployment Errors**
```bash
# Check build logs
vercel logs

# Validate locally
npm run validate

# Check for TypeScript errors
npm run type-check
```

## 📊 **Success Criteria**

Your deployment is successful when:

- ✅ Health check returns `"status": "healthy"`
- ✅ All environment variables show `true` in health check
- ✅ Wallet connects to Moonbase Alpha
- ✅ Contract data loads correctly
- ✅ All user flows work as expected
- ✅ Performance scores > 90 (Lighthouse)
- ✅ Mobile responsive design works
- ✅ No console errors in browser

## 🎉 **Next Steps After Successful Deployment**

1. **Test with Multiple Users**: Share with team members
2. **Monitor Performance**: Set up analytics and monitoring
3. **Security Audit**: Review smart contract security
4. **User Documentation**: Create user guides
5. **Mainnet Preparation**: Plan for production deployment

## 📞 **Support Resources**

- **Vercel Support**: [https://vercel.com/support](https://vercel.com/support)
- **Thirdweb Discord**: [https://discord.gg/thirdweb](https://discord.gg/thirdweb)
- **Moonbeam Documentation**: [https://docs.moonbeam.network/](https://docs.moonbeam.network/)

---

**Your deployment URL will be**: `https://your-project-name.vercel.app`

Follow this guide step by step, and your Water Pipeline Governance platform will be live and ready for testing! 🚀
