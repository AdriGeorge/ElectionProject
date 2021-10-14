import { useEffect, useState } from 'react';
import Election from './utils/Election.json';
import getWeb3 from './utils/configBc';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(async () => {
    var web3Conf = await getWeb3();
    var accounts = await web3Conf.eth.getAccounts();
    var contractConf = new web3Conf.eth.Contract(
      Election.abi,
      '0x4FfE37367d34Ad64EacbA85CDE8e746054840846'
    );

    setContract(contractConf);
    setWeb3(web3Conf);
    setAccount(accounts[0]);

    try {
      var candidatesArray = [];
      var candidatesNumber = await contractConf.methods
        .getCandidatesNumber()
        .call();
      for (var i = 0; i < candidatesNumber; i++) {
        var candidate = await contractConf.methods.candidateList(i).call();
        console.log('candidates: ', candidate);
        candidatesArray.push(candidate);
      }
      console.log('candidatesArray: ', candidatesArray);

      var candidatesObject = [];
      for (let i = 0; i < candidatesArray.length; i++) {
        console.log('address : ', candidatesArray[i]);
        var vote = await contractConf.methods
          .votesReceived(candidatesArray[i])
          .call();
        candidatesObject[i] = { address: candidatesArray[i], vote: vote };
      }
      console.log('candidateObject: ', candidatesObject);
      setCandidates(candidatesObject);
    } catch (error) {
      console.log(error);
    }
  }, [candidates]);

  async function voteForCandidate(e, candidateToVote) {
    e.preventDefault();
    try {
      var tx = await contract.methods
        .voteForCandidate(candidateToVote)
        .send({ from: account, value: web3.utils.toWei('1', 'ether') });
      console.log('tx: ', tx);
      // var vote = await getVote(candidateToVote);
    } catch (error) {
      console.log(error);
    }
  }

  async function reward() {
    var tx = await contract.methods.reward().call();
    var winner = tx.events.Winner.returnValues.winner;
    setWinner(winner);
  }

  async function modifyParams(newCandidates, maxVotes) {
    var tx = await contract.methods
      .modifyParams(newCandidates, maxVotes)
      .send({ from: account });
    console.log('tx: ', tx);
  }

  return (
    <div className='App'>
      <p>Your account: {account}</p>
      {console.log('qua: ', candidates)}
      {candidates != null &&
        candidates.map((candidateAccount, i) => {
          return (
            <div style={{ display: 'flex' }} key={i}>
              {console.log(candidateAccount.address, candidateAccount.vote)}
              <li style={{ marginRight: '10px' }}>
                candidato numero {i}: {candidateAccount.address}
              </li>
              Voti ricevuti: {candidateAccount.vote}
              <button
                style={{ marginLeft: '10px' }}
                onClick={e => voteForCandidate(e, candidateAccount.address)}
              >
                Vota
              </button>
            </div>
          );
        })}

      <b />

      {/* {winner != null &&
        winner.map(function (accountWinner, i) {
          return (
            <li key={i}>
              vincitore numero {i}: {accountWinner}
            </li>
          );
        })} */}
    </div>
  );
}

export default App;
