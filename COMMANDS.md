# 🔧 Command Reference

Quick reference for all available commands in the Water Pipeline Governance project.

## 🚀 **Setup Commands**

```bash
# Interactive environment variable setup
npm run setup:env

# Start development server
npm run dev

# Install dependencies
npm install
```

## 🔍 **Validation Commands**

```bash
# Check all build requirements
npm run validate

# TypeScript type checking
npm run type-check

# ESLint code quality check
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

## 🏗️ **Build Commands**

```bash
# Production build
npm run build

# Production build with Turbopack
npm run build:turbo

# Production build with bundle analysis
npm run build:analyze

# Start production server (after build)
npm start
```

## 🚀 **Deployment Commands**

```bash
# Deploy preview version
npm run deploy:preview

# Deploy to production
npm run deploy

# Deploy preview and show test command
npm run deploy:test

# Export static files (if needed)
npm run export
```

## 🧪 **Testing Commands**

```bash
# Test live deployment (replace URL)
npm run test:deployment https://your-app.vercel.app

# Example usage
npm run test:deployment https://water-pipeline-governance.vercel.app
```

## 📊 **Vercel CLI Commands**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy current directory
vercel

# Deploy to production
vercel --prod

# Force deploy (ignore cache)
vercel --force

# List environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable  
vercel env rm VARIABLE_NAME

# View deployment logs
vercel logs

# View project info
vercel ls

# Open project in browser
vercel open
```

## 🔧 **Development Workflow**

### **Initial Setup**
```bash
# 1. Setup environment
npm run setup:env

# 2. Validate configuration
npm run validate

# 3. Start development
npm run dev
```

### **Before Deployment**
```bash
# 1. Type check
npm run type-check

# 2. Lint code
npm run lint

# 3. Build production
npm run build

# 4. Validate for deployment
npm run validate
```

### **Deployment Process**
```bash
# Option 1: Preview deployment
npm run deploy:preview

# Option 2: Production deployment
npm run deploy

# Test deployment
npm run test:deployment https://your-url.vercel.app
```

## 🛠️ **Troubleshooting Commands**

### **Environment Issues**
```bash
# Check environment variables
vercel env ls

# Reset environment setup
npm run setup:env

# Check health endpoint
curl https://your-app.vercel.app/api/health
```

### **Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check build requirements
npm run validate
```

### **Deployment Issues**
```bash
# View deployment logs
vercel logs

# Force redeploy
vercel --force

# Check project status
vercel ls
```

## 📱 **Development Tips**

### **Local Testing**
```bash
# Development with hot reload
npm run dev

# Production simulation
npm run build && npm start

# Open in browser
open http://localhost:3000
```

### **Code Quality**
```bash
# Check all issues
npm run type-check && npm run lint

# Auto-fix what's possible
npm run lint:fix

# Full validation
npm run validate
```

### **Performance Testing**
```bash
# Build with analysis
npm run build:analyze

# Test deployment performance
npm run test:deployment https://your-app.vercel.app
```

## 🔍 **Debugging Commands**

### **Local Debugging**
```bash
# Start with debug info
DEBUG=* npm run dev

# Check console in browser (F12)
# Use debug dashboard (development only)
```

### **Production Debugging**
```bash
# Health check
curl https://your-app.vercel.app/api/health

# View logs
vercel logs

# Check environment
vercel env ls
```

## 📋 **Quick Reference**

| Task | Command |
|------|---------|
| **Setup** | `npm run setup:env` |
| **Development** | `npm run dev` |
| **Validate** | `npm run validate` |
| **Build** | `npm run build` |
| **Deploy Preview** | `npm run deploy:preview` |
| **Deploy Production** | `npm run deploy` |
| **Test Deployment** | `npm run test:deployment URL` |
| **View Logs** | `vercel logs` |
| **Environment Vars** | `vercel env ls` |

## 🚨 **Emergency Commands**

### **Site Down**
```bash
# Force redeploy
vercel --force

# Check status
vercel logs

# Rollback (if needed)
# Go to Vercel dashboard → Deployments → Promote previous
```

### **Environment Issues**
```bash
# Reset all environment variables
vercel env rm NEXT_PUBLIC_THIRDWEB_CLIENT_ID
vercel env rm NEXT_PUBLIC_CONTRACT_ADDRESS
# ... remove others

# Re-add them
npm run setup:env
# Then add to Vercel dashboard
```

### **Build Failures**
```bash
# Clean everything
rm -rf .next node_modules package-lock.json
npm install
npm run validate
npm run build
```

---

**💡 Tip**: Bookmark this page for quick reference during development and deployment!
