# Zoro Protocol

## zkSync Compatibility Changes

- block number to timestamp
  - February 7, 2106 6:28:15 AM
- maximillion transfer to .call

## Testing

### Prerequisites

It is required that you have `Docker` and `docker-compose` installed on your computer. Find the [installation guide here](https://docs.docker.com/get-docker/).

### Install the test environment

Download the local test environment for zkSync:

```bash
git clone https://github.com/matter-labs/local-setup.git
```

### Start the local nodes

```bash
cd local-setup
./start.sh
```

### Deploy test protocol

Set `ETH_PK` to `0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110` in `.env`.

Note: this private key is for a rich wallet configured by the zkSync local setup.

```bash
yarn zksync-deploy
```

### Run tests

```bash
yarn hardhat run script/test.ts
```

## Production Deployment

1. [Create a Gnosis Safe multisig](https://app.safe.global/).

2. [Deploy a production oracle](https://github.com/zoro-protocol/open-oracle/tree/master/zksync).

3. Configure addresses:

Set the admin address to a Gnosis Safe multisig and the oracle address to the production oracle.

Example using the zkSync Era chain ID 324 shown below.

```json
./zksync/deploy/addresses/main.json

{
  ...
  "admin": {
    "324": "<admin address>"
  },
  "oracle": {
    "324": "<oracle address>"
  },
  ...
}
```

4. Supply deployer account with enough assets to prevent low liquidity attacks by seeding `CToken` markets with liquidity.

The amount of assets should be enough to mint 1e8, or 10,000,000, base units of each `CToken`. The formula is `amount = 1e8 * exchangeRate`.

All `CToken` contracts are deployed with an initial exchange rate of `0.02`, but that exchange rate can change if a deposit is made between contract deployment and the deployer's deposit.

As long as the deployer can mint 1e8 for each `CToken`, the protocol is protected, even if another account manages to make a deposit first. The deployment script will not enable the market for collateral until the deployer is able to mint the required amount.

E.g. Supply `0.0000000000002` ETH to the deployer account for each `CEther` contract that will be deployed.

5. Run deployment script:

Note: you will need to set `ETH_PK` or `ETH_KEYSTORE` in `.env` with your private key or the path to your keystore file. [Either can be configured](https://github.com/zoro-protocol/hardhat-zksync-web3) for a network in `hardhat.config.ts`.

```bash
yarn zksync-deploy --network zkSyncMainnet
```

6. Transfer ownership of Comptrollers to admin multisig:

```bash
yarn hardhat transferComptrollerOwnership
```

7. Accept pending admin transfer for Comptollers by [calling `_acceptAdmin` on each contract](https://help.safe.global/en/articles/40870-contract-interactions) from the Gnosis Safe multisig.
