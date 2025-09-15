# Testing Guide for Water Pipeline Governance

This guide provides comprehensive testing procedures for the Water Pipeline Governance platform on Moonbeam testnet.

## 🎯 **Testing Overview**

### Test Environment
- **Network**: Moonbase Alpha (Moonbeam Testnet)
- **Chain ID**: 1287
- **RPC**: https://rpc.api.moonbase.moonbeam.network
- **Explorer**: https://moonbase.moonscan.io
- **Faucet**: https://apps.moonbeam.network/moonbase-alpha/faucet/

### Prerequisites
1. **MetaMask Wallet** with Moonbase Alpha network added
2. **DEV Tokens** from Moonbase Alpha faucet
3. **Contract Deployed** on Moonbase Alpha
4. **Environment Variables** configured

## 🔧 **Setup Instructions**

### 1. Add Moonbase Alpha to MetaMask
```
Network Name: Moonbase Alpha
RPC URL: https://rpc.api.moonbase.moonbeam.network
Chain ID: 1287
Currency Symbol: DEV
Block Explorer: https://moonbase.moonscan.io
```

### 2. Get Test Tokens
1. Visit: https://apps.moonbeam.network/moonbase-alpha/faucet/
2. Connect your wallet
3. Request DEV tokens for testing
4. Wait for tokens to arrive (usually < 1 minute)

### 3. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_APP_NAME="Water Pipeline Governance"
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1287
```

### 4. Deploy Contract (if needed)
1. Use Remix IDE or Hardhat
2. Connect to Moonbase Alpha
3. Deploy WaterPipelineGovernance contract
4. Copy contract address to environment variables

## 🧪 **Testing Procedures**

### Phase 1: Basic Connectivity Tests

#### Test 1.1: Wallet Connection
**Objective**: Verify wallet connection functionality

**Steps**:
1. Open application in browser
2. Click "Connect Wallet" button
3. Select MetaMask
4. Approve connection
5. Verify wallet address displays
6. Check network is Moonbase Alpha (1287)

**Expected Results**:
- ✅ Wallet connects successfully
- ✅ Network shows as "Moonbase Alpha"
- ✅ Address displays in navigation
- ✅ Admin status detected (if applicable)

**Debug Commands**:
```javascript
// In browser console
governanceLogger.getLogs()
```

#### Test 1.2: Network Detection
**Objective**: Verify correct network detection

**Steps**:
1. Connect wallet on different network (e.g., Ethereum)
2. Check if switch network prompt appears
3. Switch to Moonbase Alpha
4. Verify application recognizes correct network

**Expected Results**:
- ✅ Wrong network detected
- ✅ Switch network prompt appears
- ✅ Network switch works correctly
- ✅ Application updates after network change

### Phase 2: Admin Functionality Tests

#### Test 2.1: Admin Access Verification
**Objective**: Verify admin-only features are protected

**Prerequisites**: Deploy contract with your address as admin

**Steps**:
1. Connect wallet with admin address
2. Navigate to `/admin`
3. Verify admin panel loads
4. Check all admin functions are available

**Expected Results**:
- ✅ Admin panel accessible
- ✅ Voter registration form visible
- ✅ Proposal creation form visible
- ✅ Proposal finalization available

#### Test 2.2: Voter Registration
**Objective**: Test voter registration functionality

**Steps**:
1. Go to Admin Panel
2. Fill voter registration form:
   - Address: Valid Ethereum address
   - Type: Municipal/Engineer/Citizen
   - Weight: Appropriate number (1-100)
3. Submit transaction
4. Wait for confirmation
5. Verify registration in contract

**Test Data**:
```
Voter 1 (Municipal): weight 100
Voter 2 (Engineer): weight 50  
Voter 3 (Citizen): weight 10
```

**Expected Results**:
- ✅ Form validation works
- ✅ Transaction submits successfully
- ✅ Voter registered in contract
- ✅ Success notification appears

**Debug Check**:
```javascript
// Check voter registration in console
const contract = await governanceContract.methods.voters(voterAddress).call()
```

#### Test 2.3: Proposal Creation
**Objective**: Test proposal creation workflow

**Steps**:
1. Navigate to Admin Panel
2. Fill proposal creation form:
   - Description: "Repair water main on Oak Street"
   - Contractor Address: Valid address
   - Funds: "5.0" DEV
3. Submit transaction
4. Verify proposal appears in proposals list
5. Check proposal is in Active status

**Expected Results**:
- ✅ Proposal created successfully
- ✅ Proposal ID increments
- ✅ Status shows as "Active"
- ✅ Voting deadline set (7 days)
- ✅ Proposal visible in proposals page

### Phase 3: Voting Tests

#### Test 3.1: Registered Voter Voting
**Objective**: Test voting functionality for registered voters

**Prerequisites**: At least one active proposal and registered voters

**Steps**:
1. Connect wallet with registered voter address
2. Navigate to `/voting`
3. Select active proposal
4. Review proposal details and voter info
5. Cast YES vote
6. Confirm transaction
7. Verify vote recorded

**Expected Results**:
- ✅ Voter status recognized
- ✅ Voting power displayed correctly
- ✅ Vote confirmation modal appears
- ✅ Transaction processes successfully
- ✅ Vote count updates immediately
- ✅ Cannot vote again on same proposal

#### Test 3.2: Unregistered User Voting
**Objective**: Verify unregistered users cannot vote

**Steps**:
1. Connect wallet with unregistered address
2. Navigate to `/voting`
3. Attempt to vote on proposal

**Expected Results**:
- ✅ "Not registered to vote" message appears
- ✅ Voting buttons disabled
- ✅ Clear instructions to contact admin

#### Test 3.3: Voting Edge Cases
**Objective**: Test voting boundary conditions

**Test Cases**:
1. Vote after deadline passes
2. Vote with different wallet on same proposal
3. Attempt to vote twice
4. Vote with insufficient gas

**Expected Results**:
- ✅ Expired proposals show "Voting ended"
- ✅ Different wallets can vote separately
- ✅ Double voting prevented
- ✅ Gas errors handled gracefully

### Phase 4: Proposal Lifecycle Tests

#### Test 4.1: Proposal Finalization
**Objective**: Test proposal finalization after voting period

**Steps**:
1. Wait for proposal voting deadline to pass (or modify contract for testing)
2. Go to Admin Panel
3. Select proposal for finalization
4. Review voting results
5. Submit finalization transaction
6. Verify final status (Passed/Failed)

**Expected Results**:
- ✅ Only ended proposals can be finalized
- ✅ Final status determined by vote count
- ✅ Status updates in all views
- ✅ Proposal available for milestones (if passed)

#### Test 4.2: Milestone Management
**Objective**: Test milestone creation and management

**Prerequisites**: At least one passed proposal

**Steps**:
1. Navigate to `/milestones`
2. Select passed proposal
3. Add milestone:
   - Description: "Complete excavation"
   - Target Date: Future date
   - Release Amount: "1.0" DEV
4. Submit transaction
5. Verify milestone added

**Expected Results**:
- ✅ Only passed proposals show
- ✅ Milestone form validation works
- ✅ Milestone added successfully
- ✅ Milestone count updates

### Phase 5: UI/UX Tests

#### Test 5.1: Responsive Design
**Objective**: Verify application works on different screen sizes

**Test Devices**:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Steps**:
1. Open application on each device size
2. Test navigation menu
3. Connect wallet
4. Navigate through all pages
5. Test forms and interactions

**Expected Results**:
- ✅ Layout adapts to screen size
- ✅ Mobile navigation works
- ✅ Touch targets are adequate (44px+)
- ✅ Text remains readable
- ✅ No horizontal scrolling

#### Test 5.2: Loading States
**Objective**: Verify loading indicators work properly

**Steps**:
1. Clear cache and reload page
2. Connect wallet (observe loading)
3. Submit transactions (observe pending states)
4. Navigate between pages

**Expected Results**:
- ✅ Skeleton screens show while loading
- ✅ Spinner appears during transactions
- ✅ Loading states don't flicker
- ✅ Smooth transitions to content

#### Test 5.3: Error Handling
**Objective**: Test error scenarios and recovery

**Test Scenarios**:
1. Network connection lost
2. Wallet disconnected
3. Transaction rejected
4. Invalid form data
5. Contract errors

**Expected Results**:
- ✅ Clear error messages displayed
- ✅ Recovery options provided
- ✅ Application remains stable
- ✅ Errors logged for debugging

### Phase 6: Performance Tests

#### Test 6.1: Page Load Performance
**Objective**: Verify acceptable loading times

**Metrics**:
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Time to Interactive < 4s

**Tools**:
- Chrome DevTools Lighthouse
- Web Vitals extension

#### Test 6.2: Transaction Performance
**Objective**: Measure transaction processing times

**Metrics**:
- Transaction submission < 5s
- Confirmation feedback < 10s
- UI update after confirmation < 2s

## 🐛 **Debugging Tools**

### Development Console Commands
```javascript
// View debug dashboard (development only)
// Debug dashboard appears automatically in development

// Check logs
governanceLogger.getLogs()

// Export logs
governanceLogger.exportLogs()

// Clear logs
governanceLogger.clearLogs()

// Check wallet connection
window.ethereum?.selectedAddress

// Check current network
window.ethereum?.networkVersion
```

### Common Issues and Solutions

#### Issue: "Wrong Network" Error
**Solution**: 
1. Check MetaMask network
2. Switch to Moonbase Alpha
3. Refresh page

#### Issue: Transaction Fails
**Debugging Steps**:
1. Check DEV token balance
2. Verify gas settings
3. Check contract address
4. Review transaction in explorer

#### Issue: Wallet Connection Fails
**Solutions**:
1. Refresh page
2. Clear browser cache
3. Reset MetaMask
4. Check browser permissions

#### Issue: UI Not Updating
**Debugging**:
1. Check browser console for errors
2. Verify network connectivity
3. Check if transaction confirmed
4. Force refresh data

## 📊 **Test Reporting**

### Test Results Template
```
Test Name: [Test Name]
Date: [Date]
Tester: [Name]
Environment: Moonbase Alpha
Status: PASS/FAIL/BLOCKED

Steps:
1. [Step 1]
2. [Step 2]
...

Results:
- Expected: [Expected result]
- Actual: [Actual result]
- Issues: [Any issues found]

Screenshots: [If applicable]
Transaction Hashes: [If applicable]
```

### Critical Path Checklist
- [ ] Wallet connects to Moonbase Alpha
- [ ] Admin can register voters
- [ ] Admin can create proposals
- [ ] Voters can cast votes
- [ ] Admin can finalize proposals
- [ ] Milestones can be managed
- [ ] All pages responsive
- [ ] Error handling works
- [ ] Performance acceptable

## 🚀 **Deployment Testing**

Before mainnet deployment:

1. **Complete all test scenarios**
2. **Verify contract security**
3. **Test with multiple browsers**
4. **Load test with multiple users**
5. **Security audit (recommended)**
6. **Gas optimization review**

## 📞 **Support**

For testing issues:
1. Check debug dashboard (development)
2. Review browser console
3. Export logs for analysis
4. Check Moonbase Alpha explorer
5. Verify contract deployment

This comprehensive testing ensures the Water Pipeline Governance platform works correctly on Moonbeam testnet before production deployment.
