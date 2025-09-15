# Vercel Deployment Guide for Water Pipeline Governance

This guide walks you through deploying your Water Pipeline Governance platform to Vercel.

## 📋 **Prerequisites**

### 1. Required Accounts
- ✅ **GitHub Account** (for repository hosting)
- ✅ **Vercel Account** (connect with GitHub)
- ✅ **Thirdweb Account** (for client ID)
- ✅ **Deployed Smart Contract** on Moonbase Alpha

### 2. Required Information
- 📝 **Thirdweb Client ID** from [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
- 📝 **Contract Address** of your deployed WaterPipelineGovernance contract
- 📝 **Admin Wallet Address** for contract administration

## 🚀 **Deployment Steps**

### Step 1: Repository Setup

1. **Push to GitHub** (if not already done):
   ```bash
   cd /home/spoorthi/WaterPipelineGovernance
   git init
   git add .
   git commit -m "Initial commit: Water Pipeline Governance"
   git branch -M main
   git remote add origin https://github.com/yourusername/water-pipeline-governance.git
   git push -u origin main
   ```

### Step 2: Vercel Account Setup

1. **Visit Vercel**: Go to [vercel.com](https://vercel.com)
2. **Sign Up/Login**: Use your GitHub account
3. **Import Project**: Click "New Project" → Import from GitHub
4. **Select Repository**: Choose your `water-pipeline-governance` repository

### Step 3: Project Configuration

1. **Framework Detection**: Vercel should auto-detect Next.js
2. **Build Settings** (should be auto-configured):
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 4: Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

#### Required Variables:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID = your_actual_client_id_from_thirdweb
NEXT_PUBLIC_CONTRACT_ADDRESS = 0xYourActualContractAddress
```

#### Optional Variables:
```env
NEXT_PUBLIC_APP_NAME = Water Pipeline Governance
NEXT_PUBLIC_DEFAULT_CHAIN_ID = 1287
```

#### How to Get Values:

**🔑 Thirdweb Client ID:**
1. Visit [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Create account/login
3. Create new project
4. Copy Client ID from project settings

**📄 Contract Address:**
1. Deploy your smart contract to Moonbase Alpha
2. Copy the contract address from the deployment transaction
3. Verify deployment on [Moonbase Explorer](https://moonbase.moonscan.io)

### Step 5: Deploy

1. **Click Deploy**: Vercel will start building your project
2. **Wait for Build**: First build takes 2-5 minutes
3. **Check Logs**: Monitor build process for any errors
4. **Visit Site**: Click on the deployment URL when ready

### Step 6: Custom Domain (Optional)

1. **Go to Domains**: In Vercel project settings
2. **Add Domain**: Enter your custom domain
3. **Configure DNS**: Follow Vercel's DNS instructions
4. **SSL Certificate**: Automatically provisioned by Vercel

## 🛠️ **Build Optimizations**

### Included Optimizations:
- ✅ **React Strict Mode** enabled
- ✅ **SWC Minification** for faster builds
- ✅ **Code Splitting** for optimal loading
- ✅ **Image Optimization** with WebP/AVIF
- ✅ **Security Headers** configured
- ✅ **CSP Headers** for Web3 compatibility

### Performance Features:
- 🚀 **Standalone Output** for faster cold starts
- 🚀 **Chunk Optimization** for better caching
- 🚀 **DNS Prefetching** enabled
- 🚀 **Static Generation** where possible

## 🔧 **Local Testing Before Deployment**

### Test Production Build:
```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Lint checking
npm run lint
```

### Test Environment Variables:
1. Create `.env.local` with production values
2. Test all functionality locally
3. Verify smart contract interactions
4. Test on different devices/browsers

## 🔍 **Deployment Checklist**

### Pre-Deployment:
- [ ] Smart contract deployed and verified
- [ ] Thirdweb client ID obtained
- [ ] All environment variables ready
- [ ] Local production build tested
- [ ] No linting errors
- [ ] All pages load correctly

### Post-Deployment:
- [ ] Site loads successfully
- [ ] Wallet connection works
- [ ] Contract interactions function
- [ ] All pages accessible
- [ ] Mobile responsiveness verified
- [ ] Custom domain configured (if applicable)

## 🚨 **Troubleshooting**

### Common Build Errors:

#### **Error: Environment Variable Missing**
```
Solution: Add missing environment variables in Vercel dashboard
Check: Settings → Environment Variables
```

#### **Error: Contract Not Found**
```
Solution: Verify contract address is correct
Check: Contract deployed on correct network (Moonbase Alpha)
```

#### **Error: Thirdweb Client ID Invalid**
```
Solution: Regenerate client ID from Thirdweb dashboard
Check: Client ID copied correctly without extra spaces
```

#### **Error: Build Timeout**
```
Solution: Check for large dependencies or infinite loops
Action: Contact Vercel support if persists
```

### Performance Issues:

#### **Slow Loading**
- Check image optimization settings
- Verify code splitting is working
- Monitor Vercel analytics

#### **High Memory Usage**
- Review webpack configuration
- Check for memory leaks in components
- Consider reducing bundle size

## 📊 **Monitoring & Analytics**

### Vercel Analytics:
1. **Enable Analytics**: In Vercel dashboard
2. **Monitor Performance**: Core Web Vitals
3. **Track Usage**: Page views and user metrics
4. **Set Alerts**: For downtime or performance issues

### Custom Monitoring:
```javascript
// Add to pages for custom tracking
if (typeof window !== 'undefined') {
  console.log('Page loaded:', window.location.pathname);
}
```

## 🔄 **CI/CD Pipeline**

### Automatic Deployments:
- ✅ **Push to Main**: Automatic production deployment
- ✅ **Pull Requests**: Automatic preview deployments
- ✅ **Branch Protection**: Require reviews before merge

### Manual Deployments:
```bash
# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

## 🌐 **Multi-Environment Setup**

### Production Environment:
- **Branch**: `main`
- **URL**: `your-app.vercel.app`
- **Network**: Moonbase Alpha (testnet)

### Staging Environment (Optional):
- **Branch**: `staging`
- **URL**: `staging-your-app.vercel.app`
- **Network**: Local testnet or Sepolia

## 🔐 **Security Considerations**

### Environment Variables:
- ✅ Never commit `.env` files
- ✅ Use Vercel's secure environment variables
- ✅ Rotate keys regularly
- ✅ Monitor for exposed secrets

### Smart Contract Security:
- ✅ Verify contract on block explorer
- ✅ Test with small amounts first
- ✅ Monitor for unusual activity
- ✅ Keep admin keys secure

## 📞 **Support Resources**

### Documentation:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Thirdweb Documentation](https://portal.thirdweb.com/)

### Community:
- [Vercel Discord](https://discord.gg/vercel)
- [Next.js Discussion](https://github.com/vercel/next.js/discussions)
- [Thirdweb Discord](https://discord.gg/thirdweb)

## 🎉 **Success!**

Once deployed, your Water Pipeline Governance platform will be:
- 🌍 **Globally Available** via Vercel's CDN
- ⚡ **Fast Loading** with optimized builds
- 🔒 **Secure** with proper headers and CSP
- 📱 **Mobile Responsive** across all devices
- 🔄 **Auto-Updating** with each Git push

Your production URL will be: `https://your-project-name.vercel.app`

---

**Need Help?** Check the troubleshooting section or contact support through the provided resources.
