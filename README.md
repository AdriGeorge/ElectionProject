# Getting Started

To start this project you have to run Ganache and have the contract deployed on the Blockchain.

## Available Scripts

In the project directory, you can run:

### `npm install`

Install all dependencies that project require.

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Start from 0

npx create-react-app my-app  
truffle init
modify truffle config (network and solidity version at 0.8.0)
create smart contract
create 2 deploy contract
truffle compile
truffle migrate --network ganache
move json of smart contract inside a new folder 'utils'
npm install web3
