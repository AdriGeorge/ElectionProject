import { useEffect, useState } from 'react';
import Election from './utils/Election.json';
import getWeb3 from './utils/configBc';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState(null);

  useEffect(async () => {
    var web3Conf = await getWeb3();
    var accounts = await web3Conf.eth.getAccounts();
    var contractConf = new web3Conf.eth.Contract(
      Election.abi,
      '0x4FfE37367d34Ad64EacbA85CDE8e746054840846'
    );

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
      setCandidates(candidatesArray);
    } catch (error) {
      console.log(error);
    }

    setContract(contractConf);
    setWeb3(web3Conf);
    setAccount(accounts[0]);
  }, []);

  return (
    <div className='App'>
      <p>Your account: {account}</p>
      {candidates != null &&
        candidates.map(function (candidate, i) {
          return (
            <li key={i}>
              candidato numero {i}: {candidate}
            </li>
          );
        })}
    </div>
  );
}

export default App;
