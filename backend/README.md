Create .env file  and set private key
# For Hedera Testnet
# Testnet account ECDSA hex-encoded private key
TESTNET_OPERATOR_PRIVATE_KEY=
# Testnet JSON-RPC Relay endpoint URL (ex: 'https://testnet.hashio.io/api')
TESTNET_ENDPOINT='https://testnet.hashio.io/api'

# For Hedera Previewnet
PREVIEWNET_OPERATOR_PRIVATE_KEY="PREVIEWNET_OPERATOR_PRIVATE_KEY"
PREVIEWNET_ENDPOINT='PREVIEWNET_ENDPOINT_URL'

# For Hedera Mainnet
MAINNET_OPERATOR_PRIVATE_KEY="MAINNET_OPERATOR_PRIVATE_KEY"
MAINNET_ENDPOINT='MAINNET_ENDPOINT_URL'


Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat clean
npx hardhat compile
npx hardhat test --network testnet
```
Run the following command to deploy the smart contract. 
```shell
# deploys to the default network
npx hardhat deploy-contract

# deploys to testnet
npx hardhat deploy-contract --network testnet
```
