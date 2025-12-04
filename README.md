# 💧 Water Pipeline Governance

A decentralized governance platform for water pipeline management and decision-making, built with Next.js, Thirdweb, and smart contracts on Moonbase Alpha.

## 🌟 Features

- **🏛️ Decentralized Governance**: Democratic decision-making with weighted voting
- **🗳️ Proposal Management**: Create, vote on, and finalize infrastructure proposals
- **🎯 Milestone Tracking**: Track project progress with milestone completion
- **👥 Multi-Role System**: Municipal, Engineer, and Citizen voter types
- **📱 Mobile Responsive**: Professional UI that works on all devices
- **🔒 Secure**: Enterprise-grade security with blockchain transparency

## 🚀 Quick Start

### 1. Setup Environment

Create `.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Deploy to Production

```bash
npm run build
npm run deploy
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Web3**: Thirdweb SDK v5, ethers.js
- **Blockchain**: Moonbase Alpha (Chain ID: 1287)
- **Deployment**: Vercel

## 🏗️ Architecture

```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── admin/             # Admin panel
│   ├── governance/        # Governance features
│   ├── proposals/         # Proposal management
│   ├── voting/            # Voting interface
│   └── wallet/            # Web3 wallet
├── hooks/                  # React hooks
│   └── contract/          # Smart contract hooks
├── lib/                    # Configuration
│   ├── contract/          # Contract ABI and config
│   └── thirdweb.ts        # Web3 configuration
└── utils/                  # Utilities
```

## 🎯 User Roles

### 👤 Visitors
- View proposals and their status
- Browse milestone progress
- See voting results

### 🗳️ Registered Voters
- Cast weighted votes on active proposals
- View voting history

### ⚙️ Admin
- Register new voters with types and weights
- Create infrastructure proposals
- Finalize voting results
- Manage milestones

## 🔗 Smart Contract

The governance smart contract includes:
- **Voter Registration**: Admin-controlled voter onboarding
- **Proposal Lifecycle**: Creation, voting, and finalization
- **Weighted Voting**: Different voting power based on stakeholder type
- **Milestone Management**: Project tracking

**Network**: Moonbase Alpha (Testnet) - Chain ID 1287

## 📄 License

MIT License
