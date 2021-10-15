import { useEffect, useState } from 'react';
import Election from './utils/Election.json';
import getWeb3 from './utils/configBc';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [votes, setVotes] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(async () => {
    var web3Conf = await getWeb3();
    var accounts = await web3Conf.eth.getAccounts();
    var contractConf = new web3Conf.eth.Contract(
      Election.abi,
      '0x159b5FA1168f69F9E3a1d955d94A2DBE22Ef75aF'
    );

    setContract(contractConf);
    setWeb3(web3Conf);
    setAccount(accounts[0]);

    try {
      var candidatesArray = [];
      var candidatesNumber = await contractConf.methods
        .getSizeCandidate()
        .call();
      for (var i = 0; i < candidatesNumber; i++) {
        var candidate = await contractConf.methods.candidateList(i).call();
        //console.log('candidates: ', candidate);
        candidatesArray.push(candidate);
      }
      //console.log('candidatesArray: ', candidatesArray);
      setCandidates(candidatesArray);

      var votesArray = [];
      for (let i = 0; i < candidatesArray.length; i++) {
        //console.log('address : ', candidatesArray[i]);
        var vote = await contractConf.methods
          .votesReceived(candidatesArray[i])
          .call();
        votesArray.push(vote);
      }
      //

      //console.log('votes: ', votesArray);
      setVotes(votesArray);
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
      //console.log('tx: ', tx);
      updateVotes();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateVotes() {
    try {
      var votesArray = [];
      for (let i = 0; i < candidates.length; i++) {
        var vote = await contract.methods.votesReceived(candidates[i]).call();
        votesArray.push(vote);
      }
      setVotes(votesArray);
    } catch (error) {
      console.log(error);
    }
  }

  async function reset(e) {
    e.preventDefault();
    var tx = await contract.methods
      .reset()
      .send({ from: account, gasLimit: 21000000 });
    updateVotes();
    setWinner(null);
    //console.log('tx: ', tx);
  }

  async function reward(e) {
    e.preventDefault();
    try {
      var maxVotes = await contract.methods.maxVotes().call();
      //console.log('maxVotes', maxVotes);
      var totalVotes = await contract.methods.totalVotes().call();
      //console.log('totaleVotes: ', totalVotes);
      var tx = await contract.methods
        .reward()
        .send({ from: account, gasLimit: 21000000 });

      var winnersSize = await contract.methods.getSizeWinners().call();
      //console.log('size: ', winnersSize);
      var winnersArray = [];
      for (let i = 0; i < winnersSize; i++) {
        var win = await contract.methods.winners(i).call();
        winnersArray.push(win);
      }

      //console.log(winnersArray);
      if (winnersArray.length > 0) setWinner(winnersArray);
      //console.log('tx: ', tx);
    } catch (error) {
      console.log(error);
    }
  }

  async function modifyParams(newCandidates, maxVotes) {
    var tx = await contract.methods
      .modifyParams(newCandidates, maxVotes)
      .send({ from: account });
    //console.log('tx: ', tx);
  }

  return (
    <div className='App'>
      <p>Your account: {account}</p>
      {candidates != null &&
        votes != null &&
        candidates.map((address, i) => {
          return (
            <div style={{ display: 'flex' }} key={i}>
              <li style={{ marginRight: '10px' }}>
                candidato numero {i + 1}: {address}
              </li>
              Voti ricevuti: {votes[i]}
              <button
                style={{ marginLeft: '10px' }}
                onClick={e => voteForCandidate(e, address)}
              >
                Vota
              </button>
            </div>
          );
        })}

      <b />

      <div>
        <button onClick={e => reward(e)}>Dai la ricompensa</button>
        <button onClick={e => reset(e)}>Reset</button>
      </div>

      <b />

      {winner != null &&
        winner.map(function (accountWinner, i) {
          return (
            <li key={i}>
              vincitore numero {i + 1}: {accountWinner}
            </li>
          );
        })}
    </div>
  );
}

export default App;
