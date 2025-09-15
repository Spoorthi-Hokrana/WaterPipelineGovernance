// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WaterPipelineGovernance {
  enum ProposalStatus { Pending, Active, Passed, Failed, Executed }

  struct Proposal {
    uint256 id;
    string description;
    uint256 creationTime;
    uint256 votingDeadline;
    ProposalStatus status;
    uint256 yesVotes;
    uint256 noVotes;
    address contractAddress;  // Contractor or DAO address
    uint256 fundsEscrowed;    // Funds held for this proposal
    uint256 milestoneCount;
    mapping(uint256 => Milestone) milestones;
  }

  struct Milestone {
    string description;
    uint256 targetDate;
    bool completed;
    uint256 releaseAmount;
  }

  struct Voter {
    bool exists;
    uint8 voterType; // 1=Municipal,2=Engineer,3=Citizen
    uint256 weight;  // Voting weight based on role and stake
    mapping(uint256 => bool) votedProposals;
  }

  uint256 public proposalCount;
  mapping(uint256 => Proposal) public proposals;
  mapping(address => Voter) public voters;

  address public admin;
  uint256 constant VOTING_PERIOD = 7 days;

  event ProposalCreated(uint256 id, string description);
  event VoteCast(address voter, uint256 proposalId, bool support, uint256 weight);
  event ProposalExecuted(uint256 id);
  event MilestoneCompleted(uint256 proposalId, uint256 milestoneId);

  modifier onlyAdmin() {
    require(msg.sender == admin, "Admin only");
    _;
  }

  constructor() {
    admin = msg.sender;
  }

  // Admin adds verified voters with weights and types
  function registerVoter(address _voter, uint8 _type, uint256 _weight) external onlyAdmin {
    require(!voters[_voter].exists, "Already registered");
    voters[_voter].exists = true;
    voters[_voter].voterType = _type;
    voters[_voter].weight = _weight;
  }

  // Create maintenance/repair proposal (usually by admin or system)
  function createProposal(string calldata _desc, address _contractAddr, uint256 _fundsEscrowed) external onlyAdmin {
    proposalCount++;
    Proposal storage p = proposals[proposalCount];
    p.id = proposalCount;
    p.description = _desc;
    p.creationTime = block.timestamp;
    p.votingDeadline = block.timestamp + VOTING_PERIOD;
    p.status = ProposalStatus.Active;
    p.contractAddress = _contractAddr;
    p.fundsEscrowed = _fundsEscrowed;

    emit ProposalCreated(proposalCount, _desc);
  }

  // Stakeholders vote with their weighted votes
  function vote(uint256 _proposalId, bool support) external {
    Voter storage voter = voters[msg.sender];
    require(voter.exists, "Not a registered voter");
    Proposal storage proposal = proposals[_proposalId];
    require(block.timestamp <= proposal.votingDeadline, "Voting period ended");
    require(!voter.votedProposals[_proposalId], "Already voted");

    voter.votedProposals[_proposalId] = true;

    if (support) {
      proposal.yesVotes += voter.weight;
    } else {
      proposal.noVotes += voter.weight;
    }

    emit VoteCast(msg.sender, _proposalId, support, voter.weight);
  }

  // Admin closes voting and marks proposal passed/failed
  function finalizeProposal(uint256 _proposalId) external onlyAdmin {
    Proposal storage proposal = proposals[_proposalId];
    require(block.timestamp > proposal.votingDeadline, "Voting still active");
    require(proposal.status == ProposalStatus.Active, "Already finalized");

    if (proposal.yesVotes > proposal.noVotes) {
      proposal.status = ProposalStatus.Passed;
    } else {
      proposal.status = ProposalStatus.Failed;
    }
  }

  // Add milestones to proposals by admin/engineers
  function addMilestone(uint256 _proposalId, string calldata _desc, uint256 _targetDate, uint256 _releaseAmount) external onlyAdmin {
    Proposal storage proposal = proposals[_proposalId];
    require(proposal.status == ProposalStatus.Passed, "Proposal not passed");

    proposal.milestoneCount++;
    proposal.milestones[proposal.milestoneCount] = Milestone(_desc, _targetDate, false, _releaseAmount);
  }

  // Mark milestone as complete and release funds
  function completeMilestone(uint256 _proposalId, uint256 _milestoneId) external onlyAdmin {
    Proposal storage proposal = proposals[_proposalId];
    Milestone storage milestone = proposal.milestones[_milestoneId];

    require(!milestone.completed, "Milestone already completed");
    milestone.completed = true;

    // Here implement fund transfer logic to contractor
    // payable(proposal.contractAddress).transfer(milestone.releaseAmount);

    emit MilestoneCompleted(_proposalId, _milestoneId);
  }
}
