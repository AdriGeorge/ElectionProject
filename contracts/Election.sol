// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
// We have to specify what version of compiler this code will compile with

contract Election {
    
    address private owner;
    uint256 public maxVotes;
    uint256 public totalVotes = 0;
    
    /* mapping field below is equivalent to an associative array or hash.
    The key of the mapping is candidate name stored as type bytes32 and value is
    an unsigned integer to store the vote count
    */
    mapping (address => uint256) public votesReceived;
      
    address payable[] public candidateList;
    address payable[] private winners;
    address[] private voterList;
    
    // events
    event Vote(address voter, address voted);
    event Prize(uint256 prize, uint256 totalBalance);
    
    modifier onlyAdmin() {
        require(msg.sender == owner, "Only admin");
        _;
    }
    
    
    /* This is the constructor which will be called once when you
    deploy the contract to the blockchain. When we deploy the contract,
    we will pass an array of candidates who will be contesting in the election.
    We also pass a paramether that indicate the max number of votes allowed
    */
    constructor(address payable[] memory candidateNames, uint256 _maxVotes) {
        owner = msg.sender;
        candidateList = candidateNames;
        maxVotes = _maxVotes;
    }
    
    
    // This function increments the vote count for the specified candidate. This
    // is equivalent to casting a vote
    function voteForCandidate(address candidate) public payable {
        require(totalVotes < maxVotes, "Election closed, wait for the new round");
        require(msg.value >= 1 ether, "You have to send at least 1 ether to vote");
        require(validCandidate(candidate), "Candidate not valid");
        require(validVoter(msg.sender), "Address of voter not valid or already voted");
        votesReceived[candidate] += 1;
        voterList.push(msg.sender);
        totalVotes += 1;
        emit Vote(msg.sender, candidate);
    }
    
    // Pick the winner and reward him
    function reward() public onlyAdmin {
        require(totalVotes == maxVotes, "Election are still ongoing!");
        uint256 voteToWin = findVoteToWin();
        for(uint256 i=0; i<candidateList.length; i++){
            if(votesReceived[candidateList[i]] == voteToWin){
                winners.push(candidateList[i]);
            }
        }
        
        require(winners.length > 0, "No winner found!");
        uint256 prize = address(this).balance / winners.length;
        
        emit Prize(prize,address(this).balance);
        
        for (uint i=0; i<winners.length; i++){
            payable(winners[i]).transfer(prize);
        }
        reset();
        
    }
    
    // Reset the election
    function reset() private {
        delete totalVotes;
        delete winners;
    }
    
    // Modify the list of candidates and the required votes to end the election
    function modifyParams(address payable[] memory candidateNames,  uint256 _maxVotes) public onlyAdmin{
        require(totalVotes == 0, "Election in progress");
        candidateList = candidateNames;
        maxVotes = _maxVotes;
    }
    
    // Find the required number to win
    function findVoteToWin() private view returns (uint256) {
        uint256 voteToWin = votesReceived[candidateList[0]];
        for(uint i=1; i<candidateList.length; i++){
            if(votesReceived[candidateList[i]] > voteToWin){
                voteToWin = votesReceived[candidateList[i]];
            }
        }
        return voteToWin;
    } 
    
    // This function check if an address can vote
    function validVoter(address voter) private view returns (bool) {
        for(uint i = 0; i < voterList.length; i++) {
            if (voterList[i] == voter) {
                return false;
            }
        }
        return true;
    }
        
    // This function check if an address is a candidate
    function validCandidate(address candidate) private view returns (bool) {
        for(uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }

    function getCandidatesNumber() public view returns(uint256){
        return candidateList.length;
    }
}