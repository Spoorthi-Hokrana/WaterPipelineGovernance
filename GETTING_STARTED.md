# 🚀 Getting Started with Water Pipeline Governance

Your complete guide to deploy and test the Water Pipeline Governance platform.

## 🎯 **What You Need**

### Required:
- ✅ **MetaMask Wallet** installed
- ✅ **GitHub Account** for code hosting
- ✅ **Vercel Account** for deployment
- ✅ **10-15 minutes** for setup

### You'll Get:
- 📄 **Smart Contract** on Moonbase Alpha testnet
- 🔑 **Thirdweb Client ID** for Web3 integration
- 🌐 **Live Deployment** on Vercel
- 🧪 **Testing Tools** for validation

## ⚡ **Quick Start (5 Steps)**

### **Step 1: Deploy Smart Contract** ⏱️ 3 minutes

**Option A: Using Remix (Recommended)**
1. Open [Remix IDE](https://remix.ethereum.org)
2. Create new file: `WaterPipelineGovernance.sol`
3. Copy contract from `contracts/contract.sol` in your project
4. Compile with Solidity 0.8.17+
5. Switch MetaMask to Moonbase Alpha network:
   ```
   Network: Moonbase Alpha
   RPC: https://rpc.api.moonbase.moonbeam.network
   Chain ID: 1287
   Currency: DEV
   Explorer: https://moonbase.moonscan.io
   ```
6. Get test tokens: [Moonbase Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/)
7. Deploy contract in Remix
8. **Save the contract address** (starts with 0x...)

### **Step 2: Get Thirdweb Client ID** ⏱️ 2 minutes

1. Visit [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Sign in with wallet
3. Create new project: "Water Pipeline Governance"
4. Go to Settings → API Keys
5. **Copy the Client ID**

### **Step 3: Configure Environment Variables** ⏱️ 2 minutes

Run the interactive setup:
```bash
npm run setup:env
```

Follow the prompts:
- Enter your Thirdweb Client ID
- Enter your contract address
- Choose network (1 for Moonbase Alpha)

This creates `.env.local` for local testing.

### **Step 4: Test Locally** ⏱️ 3 minutes

```bash
# Test the build
npm run validate

# Start development server
npm run dev
```

Visit `http://localhost:3000` and:
- ✅ Connect your wallet
- ✅ Verify network shows "Moonbase Alpha"
- ✅ Check admin status (should be true for contract deployer)
- ✅ Browse all pages

### **Step 5: Deploy to Vercel** ⏱️ 5 minutes

**Option A: GitHub Integration (Recommended)**
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Connect to Vercel:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework auto-detected as Next.js

3. Add Environment Variables in Vercel:
   - Go to Settings → Environment Variables
   - Copy values from your `.env.local` file:
     ```
     NEXT_PUBLIC_THIRDWEB_CLIENT_ID = [your_client_id]
     NEXT_PUBLIC_CONTRACT_ADDRESS = 0x[your_contract_address]
     NEXT_PUBLIC_APP_NAME = Water Pipeline Governance
     NEXT_PUBLIC_DEFAULT_CHAIN_ID = 1287
     ```

4. Deploy automatically triggers

**Option B: CLI Deployment**
```bash
# Set environment variables
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_DEFAULT_CHAIN_ID

# Deploy
vercel --prod
```

## 🧪 **Test Your Deployment**

### **Automated Testing**
```bash
# Replace with your actual Vercel URL
npm run test:deployment https://your-app.vercel.app
```

Expected output:
```
✅ Basic Connectivity: Site accessible (200)
✅ Health Endpoint: Health endpoint accessible
✅ Health Status: Application status is healthy
✅ Thirdweb Client ID: Thirdweb Client ID configured
✅ Contract Address: Contract address configured
✅ Network Configuration: Configured for Moonbase Alpha (1287)
```

### **Manual Testing**

Visit your deployed site and verify:

#### **Basic Functionality**
- [ ] Site loads without errors
- [ ] All pages accessible (/, /proposals, /voting, /milestones, /admin)
- [ ] Mobile responsive design

#### **Wallet & Web3**
- [ ] "Connect Wallet" button appears
- [ ] MetaMask connection works
- [ ] Network shows "Moonbase Alpha (1287)"
- [ ] Wrong network prompts switch
- [ ] Wallet address displays in navigation

#### **Smart Contract Integration**
- [ ] Contract admin address loads
- [ ] Proposal count displays (likely 0 initially)
- [ ] Admin status detected correctly
- [ ] Health check returns healthy status

## 🎛️ **Admin Features** (For Contract Deployer)

If you deployed the contract, you're the admin and can:

### **Register Voters**
1. Go to `/admin` page
2. Add voter addresses with types and weights:
   - **Municipal**: Weight 100 (high authority)
   - **Engineer**: Weight 50 (technical expertise)
   - **Citizen**: Weight 10 (community voice)

### **Create Proposals**
1. Fill proposal form with:
   - Description: "Repair water main on Oak Street"
   - Contractor Address: Any valid Ethereum address
   - Funds: "5.0" (DEV tokens)
2. Submit creates 7-day voting period

### **Finalize Proposals**
1. Wait for voting period to end
2. Admin can finalize to determine pass/fail
3. Passed proposals available for milestone management

## 📊 **Understanding the Platform**

### **User Types**
- **👤 Visitors**: Can view proposals and milestones
- **🗳️ Registered Voters**: Can vote on active proposals
- **⚙️ Admin**: Full access to governance functions

### **Proposal Lifecycle**
1. **Created** → Active 7-day voting period
2. **Voting** → Weighted votes from registered users
3. **Finalized** → Admin determines outcome based on votes
4. **Milestones** → Passed proposals get milestone tracking

### **Key Features**
- **🏛️ Decentralized Governance**: Democratic decision-making
- **🔗 Blockchain Transparency**: All actions recorded immutably
- **💰 Milestone-Based Funding**: Automatic fund release on completion
- **📱 Mobile Responsive**: Works on all devices
- **🔒 Secure**: Enterprise-grade security headers

## 🛠️ **Available Commands**

```bash
# Setup and Development
npm run setup:env          # Interactive environment setup
npm run dev                 # Start development server
npm run build              # Production build
npm run start              # Start production server

# Validation and Testing
npm run validate            # Check build requirements
npm run type-check         # TypeScript validation
npm run lint               # Code quality check
npm run test:deployment    # Test live deployment

# Deployment
npm run deploy:preview     # Deploy preview
npm run deploy             # Deploy to production
npm run deploy:test        # Deploy and show test command

# Vercel Management
vercel env ls              # List environment variables
vercel logs               # View deployment logs
vercel --force            # Force redeploy
```

## 🚨 **Troubleshooting**

### **Common Issues**

**❌ "Environment variables missing"**
```bash
# Check current variables
vercel env ls

# Add missing variables in Vercel dashboard
# Or run: npm run setup:env
```

**❌ "Contract not found"**
```bash
# Verify contract address on Moonbase Explorer
# Check: https://moonbase.moonscan.io/address/YOUR_CONTRACT_ADDRESS
```

**❌ "Build failed"**
```bash
# Check locally first
npm run validate
npm run build

# View deployment logs
vercel logs
```

**❌ "Wallet connection fails"**
```bash
# Ensure MetaMask has Moonbase Alpha network
# Check Thirdweb client ID is correct
# Verify site is on HTTPS (required for Web3)
```

### **Getting Help**

- 📖 **Detailed Guides**: `DEPLOYMENT_GUIDE.md`, `ENVIRONMENT_SETUP.md`
- 🧪 **Testing**: `TESTING_GUIDE.md`
- ✅ **Quick Reference**: `DEPLOYMENT_CHECKLIST.md`
- 🔧 **Environment**: `VERCEL_ENV_SETUP.md`

## 🎉 **Success!**

Once everything is working:

✅ **Your governance platform is live** at `https://your-project.vercel.app`  
✅ **Users can connect wallets** and participate in governance  
✅ **Smart contract integration** enables decentralized decision-making  
✅ **Mobile-responsive design** works on all devices  
✅ **Professional security** and performance optimization  

## 🚀 **Next Steps**

1. **Test with Real Users**: Share with team members
2. **Create Test Scenarios**: Register voters and create proposals
3. **Monitor Performance**: Use Vercel analytics
4. **Plan for Production**: Consider mainnet deployment
5. **Community Building**: Engage stakeholders in governance

---

**Your Water Pipeline Governance platform is ready to revolutionize infrastructure decision-making through blockchain technology!** 🌊🏛️

**Need help?** Check the documentation files or reach out through the support channels listed above.
