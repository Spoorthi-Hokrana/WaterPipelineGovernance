# Vercel Environment Variables Setup

Quick reference for setting up environment variables in Vercel dashboard.

## 🔧 **Required Environment Variables**

### 1. Thirdweb Client ID
```
Name: NEXT_PUBLIC_THIRDWEB_CLIENT_ID
Value: [Get from https://thirdweb.com/dashboard]
Environment: Production, Preview, Development
```

**How to Get:**
1. Visit [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Sign up/Login with your wallet
3. Create a new project
4. Copy the Client ID from project settings

### 2. Smart Contract Address
```
Name: NEXT_PUBLIC_CONTRACT_ADDRESS  
Value: 0x[YourContractAddress]
Environment: Production, Preview, Development
```

**How to Get:**
1. Deploy your WaterPipelineGovernance contract to Moonbase Alpha
2. Copy the contract address from deployment transaction
3. Verify on [Moonbase Explorer](https://moonbase.moonscan.io)

## ⚙️ **Optional Environment Variables**

### 3. Application Name
```
Name: NEXT_PUBLIC_APP_NAME
Value: Water Pipeline Governance
Environment: Production, Preview, Development
```

### 4. Default Chain ID
```
Name: NEXT_PUBLIC_DEFAULT_CHAIN_ID
Value: 1287
Environment: Production, Preview, Development
```

**Network Options:**
- `1287` - Moonbase Alpha (Testnet) - **Recommended for testing**
- `1284` - Moonbeam Mainnet
- `1` - Ethereum Mainnet
- `137` - Polygon Mainnet

## 📱 **Setting Variables in Vercel**

### Via Dashboard:
1. Go to your project in Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in sidebar
4. Click **Add New**
5. Enter Name and Value
6. Select environments (Production, Preview, Development)
7. Click **Save**

### Via CLI:
```bash
# Add environment variable
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm NEXT_PUBLIC_THIRDWEB_CLIENT_ID
```

## 🔒 **Security Best Practices**

### Environment Variable Security:
- ✅ **Never commit** environment variables to Git
- ✅ **Use Vercel's secure storage** for sensitive values
- ✅ **Rotate keys regularly** especially for production
- ✅ **Monitor usage** through Thirdweb dashboard

### Smart Contract Security:
- ✅ **Verify contract** on block explorer before adding address
- ✅ **Test thoroughly** on testnet before mainnet
- ✅ **Use multisig** for admin functions in production
- ✅ **Audit contract** before handling significant funds

## 🧪 **Testing Environment Variables**

### Local Testing:
Create `.env.local` file (not committed to Git):
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_test_client_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourTestContractAddress
NEXT_PUBLIC_APP_NAME="Water Pipeline Governance (Local)"
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1287
```

### Validation:
```bash
# Run validation script
npm run validate

# Check health endpoint after deployment
curl https://your-app.vercel.app/api/health
```

## 🌍 **Multi-Environment Setup**

### Production Environment:
- **Branch**: `main`
- **Network**: Moonbase Alpha (1287) or Moonbeam Mainnet (1284)
- **Contract**: Production contract address
- **Client ID**: Production Thirdweb client ID

### Preview Environment:
- **Branch**: `develop` or pull requests
- **Network**: Moonbase Alpha (1287)
- **Contract**: Testnet contract address
- **Client ID**: Development Thirdweb client ID

### Development Environment:
- **Branch**: Any
- **Network**: Local or Moonbase Alpha
- **Contract**: Local or testnet contract
- **Client ID**: Development Thirdweb client ID

## 🚨 **Troubleshooting**

### Common Issues:

#### **Variables Not Loading**
```
Problem: Environment variables showing as undefined
Solution: 
1. Check variable names match exactly (case-sensitive)
2. Ensure NEXT_PUBLIC_ prefix for client-side variables
3. Redeploy after adding variables
4. Check environment scope (Production/Preview/Development)
```

#### **Contract Not Found**
```
Problem: "Contract not found" errors
Solution:
1. Verify contract address format (0x + 40 hex characters)
2. Confirm contract deployed on correct network
3. Check network ID matches NEXT_PUBLIC_DEFAULT_CHAIN_ID
4. Verify contract is verified on block explorer
```

#### **Thirdweb Client ID Invalid**
```
Problem: Thirdweb connection fails
Solution:
1. Regenerate client ID in Thirdweb dashboard
2. Check for extra spaces or characters
3. Ensure variable is set in correct environment
4. Verify Thirdweb project is active
```

## 📊 **Environment Variable Checklist**

### Before Deployment:
- [ ] All required variables set in Vercel
- [ ] Variable names exactly match (including NEXT_PUBLIC_ prefix)
- [ ] Values are correct and tested locally
- [ ] Contract address is verified on block explorer
- [ ] Thirdweb client ID is active
- [ ] Environment scope is set correctly

### After Deployment:
- [ ] Application loads without errors
- [ ] Wallet connection works
- [ ] Contract interactions function
- [ ] Health check endpoint returns success
- [ ] All features tested on actual deployment

## 📞 **Support**

### Getting Help:
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Thirdweb Issues**: [Thirdweb Discord](https://discord.gg/thirdweb)
- **Smart Contract**: [Moonbeam Documentation](https://docs.moonbeam.network/)

### Useful Commands:
```bash
# Check environment in deployment
vercel env ls

# View deployment logs
vercel logs [deployment-url]

# Force redeploy
vercel --force

# Health check
curl https://your-app.vercel.app/api/health
```

---

**Quick Start:** Copy the template values above, replace with your actual values, and paste into Vercel dashboard environment variables section.
