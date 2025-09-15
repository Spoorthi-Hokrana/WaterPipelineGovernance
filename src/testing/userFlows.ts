/**
 * User Flow Testing Scenarios for Water Pipeline Governance
 */

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedOutcome: string;
  userType: "admin" | "voter" | "visitor";
}

export interface TestStep {
  action: string;
  description: string;
  expectedResult: string;
  criticalPath: boolean;
}

export const USER_FLOWS: TestScenario[] = [
  {
    id: "wallet-connection",
    name: "Wallet Connection Flow",
    description: "Test wallet connection and disconnection functionality",
    userType: "visitor",
    steps: [
      {
        action: "navigate_to_homepage",
        description: "Visit the homepage",
        expectedResult: "Homepage loads with connect wallet button",
        criticalPath: true,
      },
      {
        action: "click_connect_wallet",
        description: "Click the Connect Wallet button",
        expectedResult: "Wallet connection modal opens",
        criticalPath: true,
      },
      {
        action: "connect_metamask",
        description: "Connect using MetaMask",
        expectedResult: "Wallet connects successfully, user info displayed",
        criticalPath: true,
      },
      {
        action: "check_network",
        description: "Verify connected to Moonbase Alpha",
        expectedResult: "Network shows as Moonbase Alpha (1287)",
        criticalPath: true,
      },
      {
        action: "disconnect_wallet",
        description: "Disconnect the wallet",
        expectedResult: "Wallet disconnects, connect button reappears",
        criticalPath: false,
      },
    ],
    expectedOutcome: "User can successfully connect and disconnect wallet on Moonbase Alpha",
  },

  {
    id: "admin-voter-registration",
    name: "Admin Voter Registration Flow",
    description: "Test admin ability to register new voters",
    userType: "admin",
    steps: [
      {
        action: "connect_admin_wallet",
        description: "Connect wallet with admin privileges",
        expectedResult: "Wallet connects and admin panel is accessible",
        criticalPath: true,
      },
      {
        action: "navigate_to_admin",
        description: "Navigate to admin panel",
        expectedResult: "Admin panel loads with voter registration form",
        criticalPath: true,
      },
      {
        action: "fill_voter_form",
        description: "Fill voter registration form with valid data",
        expectedResult: "Form accepts valid input",
        criticalPath: true,
      },
      {
        action: "submit_voter_registration",
        description: "Submit voter registration transaction",
        expectedResult: "Transaction submits successfully and voter is registered",
        criticalPath: true,
      },
      {
        action: "verify_voter_registration",
        description: "Verify voter appears in system",
        expectedResult: "Voter is successfully registered with correct type and weight",
        criticalPath: true,
      },
    ],
    expectedOutcome: "Admin can successfully register voters with different types and weights",
  },

  {
    id: "admin-proposal-creation",
    name: "Admin Proposal Creation Flow",
    description: "Test admin ability to create governance proposals",
    userType: "admin",
    steps: [
      {
        action: "navigate_to_admin",
        description: "Go to admin panel",
        expectedResult: "Admin panel loads with proposal creation form",
        criticalPath: true,
      },
      {
        action: "fill_proposal_form",
        description: "Fill proposal creation form",
        expectedResult: "Form validates input correctly",
        criticalPath: true,
      },
      {
        action: "submit_proposal",
        description: "Submit proposal creation transaction",
        expectedResult: "Proposal is created and appears in proposals list",
        criticalPath: true,
      },
      {
        action: "verify_proposal_active",
        description: "Verify proposal is in Active status",
        expectedResult: "Proposal shows as Active with 7-day voting period",
        criticalPath: true,
      },
      {
        action: "check_proposal_details",
        description: "View proposal details page",
        expectedResult: "All proposal information displays correctly",
        criticalPath: false,
      },
    ],
    expectedOutcome: "Admin can create proposals that become available for voting",
  },

  {
    id: "voter-voting-flow",
    name: "Voter Voting Flow",
    description: "Test registered voter ability to cast votes",
    userType: "voter",
    steps: [
      {
        action: "connect_voter_wallet",
        description: "Connect wallet of registered voter",
        expectedResult: "Wallet connects and voter status is recognized",
        criticalPath: true,
      },
      {
        action: "navigate_to_voting",
        description: "Go to voting interface",
        expectedResult: "Voting page loads with active proposals",
        criticalPath: true,
      },
      {
        action: "select_proposal",
        description: "Select an active proposal to vote on",
        expectedResult: "Proposal voting interface loads with voter info",
        criticalPath: true,
      },
      {
        action: "cast_yes_vote",
        description: "Cast a YES vote on the proposal",
        expectedResult: "Vote confirmation modal appears",
        criticalPath: true,
      },
      {
        action: "confirm_vote",
        description: "Confirm the vote transaction",
        expectedResult: "Vote is cast successfully and reflected in proposal",
        criticalPath: true,
      },
      {
        action: "verify_vote_recorded",
        description: "Check that vote was recorded",
        expectedResult: "Vote appears in proposal results with correct weight",
        criticalPath: true,
      },
    ],
    expectedOutcome: "Registered voters can successfully cast weighted votes on active proposals",
  },

  {
    id: "proposal-finalization",
    name: "Proposal Finalization Flow",
    description: "Test admin ability to finalize voting and determine outcomes",
    userType: "admin",
    steps: [
      {
        action: "wait_voting_period",
        description: "Wait for voting period to end",
        expectedResult: "Proposal voting deadline passes",
        criticalPath: true,
      },
      {
        action: "navigate_to_admin",
        description: "Go to admin panel finalization section",
        expectedResult: "Finalization form loads with eligible proposals",
        criticalPath: true,
      },
      {
        action: "select_proposal_finalize",
        description: "Select proposal for finalization",
        expectedResult: "Proposal details show with voting results",
        criticalPath: true,
      },
      {
        action: "finalize_proposal",
        description: "Submit finalization transaction",
        expectedResult: "Proposal status changes to Passed or Failed",
        criticalPath: true,
      },
      {
        action: "verify_final_status",
        description: "Verify proposal final status",
        expectedResult: "Proposal shows final status based on vote results",
        criticalPath: true,
      },
    ],
    expectedOutcome: "Admin can finalize proposals and determine pass/fail status based on votes",
  },

  {
    id: "milestone-management",
    name: "Milestone Management Flow",
    description: "Test milestone creation and completion for passed proposals",
    userType: "admin",
    steps: [
      {
        action: "navigate_to_milestones",
        description: "Go to milestone management page",
        expectedResult: "Milestone page loads with passed proposals",
        criticalPath: true,
      },
      {
        action: "select_passed_proposal",
        description: "Select a passed proposal for milestone management",
        expectedResult: "Proposal details load with milestone form",
        criticalPath: true,
      },
      {
        action: "add_milestone",
        description: "Add a new milestone with details",
        expectedResult: "Milestone is added to the proposal",
        criticalPath: true,
      },
      {
        action: "verify_milestone_added",
        description: "Verify milestone appears in proposal",
        expectedResult: "Milestone shows in proposal with correct details",
        criticalPath: true,
      },
      {
        action: "complete_milestone",
        description: "Mark milestone as completed",
        expectedResult: "Milestone status changes to completed",
        criticalPath: false,
      },
    ],
    expectedOutcome: "Admin can add and manage milestones for passed proposals",
  },

  {
    id: "responsive-mobile-test",
    name: "Mobile Responsive Testing",
    description: "Test application functionality on mobile devices",
    userType: "voter",
    steps: [
      {
        action: "open_mobile_browser",
        description: "Access site on mobile device or mobile view",
        expectedResult: "Site loads properly on mobile viewport",
        criticalPath: true,
      },
      {
        action: "test_navigation",
        description: "Test mobile navigation menu",
        expectedResult: "Hamburger menu works and navigation is accessible",
        criticalPath: true,
      },
      {
        action: "connect_wallet_mobile",
        description: "Connect wallet on mobile",
        expectedResult: "Wallet connection works on mobile",
        criticalPath: true,
      },
      {
        action: "test_voting_mobile",
        description: "Test voting interface on mobile",
        expectedResult: "Voting interface is usable on mobile devices",
        criticalPath: true,
      },
      {
        action: "check_responsiveness",
        description: "Verify all pages are responsive",
        expectedResult: "All pages adapt properly to mobile screen sizes",
        criticalPath: false,
      },
    ],
    expectedOutcome: "Application is fully functional and usable on mobile devices",
  },

  {
    id: "error-handling-test",
    name: "Error Handling and Edge Cases",
    description: "Test error scenarios and edge cases",
    userType: "voter",
    steps: [
      {
        action: "test_wrong_network",
        description: "Connect wallet on wrong network",
        expectedResult: "User sees network switch prompt",
        criticalPath: true,
      },
      {
        action: "test_unregistered_voter",
        description: "Try to vote as unregistered user",
        expectedResult: "User sees not registered message",
        criticalPath: true,
      },
      {
        action: "test_double_voting",
        description: "Try to vote twice on same proposal",
        expectedResult: "Second vote attempt is prevented",
        criticalPath: true,
      },
      {
        action: "test_invalid_inputs",
        description: "Submit forms with invalid data",
        expectedResult: "Proper validation errors are shown",
        criticalPath: true,
      },
      {
        action: "test_transaction_failure",
        description: "Simulate transaction failure",
        expectedResult: "Error is handled gracefully with user feedback",
        criticalPath: false,
      },
    ],
    expectedOutcome: "Application handles errors gracefully and provides clear user feedback",
  },
];

export const CRITICAL_PATHS = USER_FLOWS.flatMap(flow => 
  flow.steps.filter(step => step.criticalPath)
    .map(step => ({ flowId: flow.id, ...step }))
);

export function getTestsByUserType(userType: "admin" | "voter" | "visitor") {
  return USER_FLOWS.filter(flow => flow.userType === userType);
}

export function getCriticalPathTests() {
  return CRITICAL_PATHS;
}
