# Solidity Backend with Hardhat

Solidity-based backend setup using Hardhat for smart contract development. It supports compilation, testing, and deployment of smart contracts to Hedera's Testnet, Previewnet, and Mainnet.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Hardhat](https://hardhat.org/)

---

## Environment Configuration

1. Create a `.env` file in the root directory of your backend project folder.
2. Add the following configurations for Hedera networks:

```dotenv
# For Hedera Testnet
TESTNET_OPERATOR_PRIVATE_KEY=
TESTNET_ENDPOINT='https://testnet.hashio.io/api'

# For Hedera Previewnet
PREVIEWNET_OPERATOR_PRIVATE_KEY="PREVIEWNET_OPERATOR_PRIVATE_KEY"
PREVIEWNET_ENDPOINT='PREVIEWNET_ENDPOINT_URL'

# For Hedera Mainnet
MAINNET_OPERATOR_PRIVATE_KEY="MAINNET_OPERATOR_PRIVATE_KEY"
MAINNET_ENDPOINT='MAINNET_ENDPOINT_URL'
---


## Run the following command to build and test the smart contract.

```shell
npx hardhat help
npx hardhat clean
npx hardhat compile
npx hardhat test --network testnet
```

## Run the following command to deploy the smart contract. 
```shell
# deploys to the default network
npx hardhat deploy-contract

# deploys to testnet
npx hardhat deploy-contract --network testnet
```





