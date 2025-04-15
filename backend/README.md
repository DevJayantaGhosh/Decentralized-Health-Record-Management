# Solidity Backend with Hardhat

Solidity-based backend setup using Hardhat for smart contract development

---



## Environment Configuration

1. Create a `.env` file in the root directory of your backend project folder.
2. Add the following configurations for Hedera networks:

```dotenv
# For Hedera Testnet
TESTNET_OPERATOR_PRIVATE_KEY=
TESTNET_ENDPOINT='https://testnet.hashio.io/api'
```




## Run the following command to deploy the smart contract. 
```shell
# Run the following command to build and test the smart contract.
npx hardhat help
npx hardhat clean
npx hardhat compile
npx hardhat test --network testnet

# deploys to the default network
npx hardhat deploy-contract

# deploys to testnet
npx hardhat deploy-contract --network testnet
```





