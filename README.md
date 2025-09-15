# 💧 Water Pipeline Governance

A decentralized governance platform for water pipeline management and decision-making, built with Next.js, Thirdweb, and smart contracts on Moonbeam.

## 🌟 **Features**

- **🏛️ Decentralized Governance**: Democratic decision-making with weighted voting
- **🗳️ Proposal Management**: Create, vote on, and finalize infrastructure proposals
- **🎯 Milestone Tracking**: Track project progress with automatic fund release
- **👥 Multi-Role System**: Municipal, Engineer, and Citizen voter types
- **📱 Mobile Responsive**: Professional UI that works on all devices
- **🔒 Secure**: Enterprise-grade security with blockchain transparency
- **⚡ Fast**: Optimized for performance with Vercel deployment

## 🚀 **Quick Start**

### **1. Deploy Smart Contract**
```bash
# Use Remix IDE or Thirdweb Deploy
# Deploy to Moonbase Alpha testnet
# Save the contract address
```

### **2. Setup Environment**
```bash
# Interactive environment setup
npm run setup:env

# Test locally
npm run dev
```

### **3. Deploy to Vercel**
```bash
# Push to GitHub and connect to Vercel
# Or use CLI deployment
npm run deploy
```

**📖 For detailed instructions, see [`GETTING_STARTED.md`](./GETTING_STARTED.md)**

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Web3**: Thirdweb SDK v5, ethers.js
- **Blockchain**: Moonbeam/Moonbase Alpha
- **Deployment**: Vercel with optimized configuration
- **Testing**: Comprehensive validation and testing tools

## 📚 **Documentation**

| Guide | Description |
|-------|-------------|
| [`GETTING_STARTED.md`](./GETTING_STARTED.md) | **Start here** - Complete setup in 15 minutes |
| [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) | Comprehensive deployment instructions |
| [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md) | Environment variables and blockchain setup |
| [`TESTING_GUIDE.md`](./TESTING_GUIDE.md) | Testing on Moonbeam testnet |
| [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) | Quick deployment checklist |
| [`VERCEL_ENV_SETUP.md`](./VERCEL_ENV_SETUP.md) | Vercel environment variable reference |

## ⚡ **Commands**

```bash
# Setup and Development
npm run setup:env          # Interactive environment setup
npm run dev                 # Start development server
npm run build              # Production build

# Validation and Testing  
npm run validate            # Check build requirements
npm run test:deployment    # Test live deployment
npm run type-check         # TypeScript validation

# Deployment
npm run deploy:preview     # Deploy preview
npm run deploy             # Deploy to production
```

## 🏗️ **Architecture**

```
📁 Water Pipeline Governance/
├── 📄 contracts/contract.sol          # Smart contract
├── 📁 src/
│   ├── 📁 app/                        # Next.js app router
│   ├── 📁 components/                 # React components
│   │   ├── 📁 admin/                  # Admin panel components
│   │   ├── 📁 proposals/              # Proposal management
│   │   ├── 📁 voting/                 # Voting interface
│   │   ├── 📁 milestones/             # Milestone tracking
│   │   └── 📁 wallet/                 # Web3 wallet integration
│   ├── 📁 hooks/                      # React hooks
│   │   ├── 📁 contract/               # Smart contract hooks
│   │   └── 📁 ui/                     # UI state management
│   ├── 📁 lib/                        # Configuration
│   │   ├── 📄 thirdweb.ts             # Web3 configuration
│   │   └── 📁 contract/               # Contract ABI and config
│   └── 📁 utils/                      # Utilities and helpers
├── 📁 scripts/                        # Deployment and validation
└── 📚 Documentation files
```

## 🎯 **User Roles**

### **👤 Visitors**
- View proposals and their status
- Browse milestone progress
- See voting results

### **🗳️ Registered Voters**
- Cast weighted votes on active proposals
- View voting history
- Access voter dashboard

### **⚙️ Admin**
- Register new voters with types and weights
- Create infrastructure proposals
- Finalize voting results
- Manage milestones and fund release

## 🔗 **Smart Contract**

The governance smart contract includes:
- **Voter Registration**: Admin-controlled voter onboarding
- **Proposal Lifecycle**: Creation, voting, and finalization
- **Weighted Voting**: Different voting power based on stakeholder type
- **Milestone Management**: Project tracking with fund release
- **Security Features**: Admin controls and voting period limits

**Contract Address**: Set in environment variables  
**Network**: Moonbase Alpha (Testnet) - Chain ID 1287

## 🧪 **Testing**

### **Automated Testing**
```bash
# Test deployment health
npm run test:deployment https://your-app.vercel.app

# Validate build requirements
npm run validate
```

### **Manual Testing**
- Connect wallet to Moonbase Alpha
- Test admin functions (voter registration, proposals)
- Test voting with different user roles
- Verify milestone tracking
- Check mobile responsiveness

## 🚨 **Troubleshooting**

**Common Issues:**
- **Environment variables missing**: Run `npm run setup:env`
- **Contract not found**: Verify contract address and network
- **Build failed**: Check `npm run validate` and fix issues
- **Wallet connection fails**: Ensure HTTPS and correct network

**Get Help:**
- Check documentation files for detailed guides
- View deployment logs: `vercel logs`
- Test locally: `npm run dev`

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Links**

- **Live Demo**: [Your Vercel URL]
- **Smart Contract**: [Moonbase Explorer Link]
- **Thirdweb**: [Dashboard Link]
- **Documentation**: Repository docs folder

## 🎉 **Success Stories**

This platform enables:
- **Transparent Infrastructure Decisions**: All votes recorded on blockchain
- **Community Participation**: Citizens have a voice in local projects
- **Efficient Fund Management**: Milestone-based release ensures accountability
- **Professional Governance**: Modern UI with enterprise-grade security

---

**🚀 Ready to transform infrastructure governance? Start with [`GETTING_STARTED.md`](./GETTING_STARTED.md)!**