# 🚀 Deployment Checklist

Quick checklist to deploy your Water Pipeline Governance platform to Vercel.

## ✅ **Pre-Deployment Checklist**

### 1. **Smart Contract Setup**
- [ ] Contract deployed to Moonbase Alpha
- [ ] Contract address copied and verified on [Moonbase Explorer](https://moonbase.moonscan.io)
- [ ] Admin wallet has DEV tokens for transactions
- [ ] Contract functions tested manually (optional)

### 2. **Thirdweb Setup** 
- [ ] Account created at [thirdweb.com](https://thirdweb.com/dashboard)
- [ ] Project created in Thirdweb dashboard
- [ ] Client ID copied from project settings
- [ ] Client ID tested with a simple connection

### 3. **Environment Variables**
- [ ] Run interactive setup: `npm run setup:env`
- [ ] Verify `.env.local` created correctly
- [ ] Test locally: `npm run dev`
- [ ] All pages load without errors

### 4. **Code Quality**
- [ ] Build validation passes: `npm run validate`
- [ ] TypeScript compilation succeeds: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Production build succeeds: `npm run build`

## 🚀 **Deployment Steps**

### Method 1: GitHub + Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect to Vercel
# Visit: https://vercel.com/new
# Import your GitHub repository
# Framework will be auto-detected as Next.js

# 3. Add Environment Variables in Vercel Dashboard
# Go to: Settings → Environment Variables
# Add all variables from your .env.local file

# 4. Deploy
# Deployment will start automatically
```

### Method 2: Direct CLI Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Set Environment Variables
npm run setup:env  # Follow the prompts
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_DEFAULT_CHAIN_ID

# 4. Deploy
vercel --prod
```

## 🧪 **Post-Deployment Testing**

### 1. **Automated Testing**
```bash
# Test your deployment (replace with your actual URL)
npm run test:deployment https://your-app.vercel.app
```

### 2. **Manual Testing Checklist**
- [ ] Site loads without errors
- [ ] Health check passes: `https://your-app.vercel.app/api/health`
- [ ] Wallet connection works
- [ ] Correct network detected (Moonbase Alpha)
- [ ] All pages accessible and responsive
- [ ] Contract data loads (admin address, proposal count)

### 3. **Functional Testing**
- [ ] Connect wallet to Moonbase Alpha
- [ ] Admin features work (if you're admin)
- [ ] Navigation works on mobile/desktop
- [ ] Loading states and notifications work
- [ ] Error handling works (try wrong network)

## 🎯 **Success Criteria**

Your deployment is successful when:

✅ **Health Check**: Returns `"status": "healthy"`  
✅ **Environment**: All variables show `true` in health response  
✅ **Connectivity**: All critical pages load (/, /proposals, /voting, /milestones, /admin)  
✅ **Web3**: Wallet connects and detects Moonbase Alpha  
✅ **Contract**: Admin address and proposal count load correctly  
✅ **Performance**: Page load time < 3 seconds  
✅ **Security**: Security headers present  
✅ **Mobile**: Responsive design works on mobile devices  

## 🚨 **Common Issues & Solutions**

### **"Environment variables missing"**
```bash
# Solution: Add missing variables in Vercel dashboard
vercel env ls  # Check current variables
# Add missing ones via dashboard or CLI
```

### **"Contract not found"** 
```bash
# Solution: Verify contract address and network
# 1. Check contract exists on Moonbase Alpha
# 2. Verify address format (0x + 40 hex chars)
# 3. Confirm network ID is 1287
```

### **"Build failed"**
```bash
# Solution: Check build logs and fix issues
vercel logs  # View deployment logs
npm run validate  # Check locally
npm run build  # Test build locally
```

### **"Wallet connection fails"**
```bash
# Solution: Check Web3 configuration
# 1. Ensure site is on HTTPS
# 2. Check Thirdweb client ID is correct
# 3. Verify MetaMask has Moonbase Alpha network
```

## 📊 **Quick Commands**

```bash
# Setup and validation
npm run setup:env          # Interactive environment setup
npm run validate            # Check build requirements
npm run build              # Test production build

# Deployment
npm run deploy:preview     # Deploy preview version
npm run deploy             # Deploy to production
npm run test:deployment    # Test live deployment

# Vercel management
vercel env ls              # List environment variables
vercel logs               # View deployment logs
vercel --force            # Force redeploy
```

## 🎉 **You're Ready!**

Once all checklist items are complete:

1. Your Water Pipeline Governance platform will be live at `https://your-project.vercel.app`
2. Users can connect wallets and interact with your smart contract
3. The platform is optimized for performance and security
4. You have full monitoring and testing capabilities

## 📞 **Need Help?**

- **Documentation**: Check `ENVIRONMENT_SETUP.md` for detailed instructions
- **Testing Issues**: Review `DEPLOYMENT_GUIDE.md` troubleshooting section
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Thirdweb Discord**: [discord.gg/thirdweb](https://discord.gg/thirdweb)

---

**Remember**: Your platform is configured for Moonbase Alpha testnet. For production, you'll need to deploy your contract to Moonbeam mainnet and update the network configuration.
