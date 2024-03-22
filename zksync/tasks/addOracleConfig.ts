import { ethers } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-web3";
import { type TokenConfig } from "../open-oracle/configuration/parameters-price-oracle";
import { getTokenConfig } from "../script/oracle";
import { AddOracleConfigParams } from "../script/types";

const ORACLE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "cToken",
        "type": "address"
      }
    ],
    "name": "getConfig",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "baseUnit",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "cToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "priceFeed",
            "type": "address"
          }
        ],
        "internalType": "struct PriceOracle.TokenConfig",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "baseUnit",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "cToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "priceFeed",
            "type": "address"
          }
        ],
        "internalType": "struct PriceOracle.TokenConfig",
        "name": "config",
        "type": "tuple"
      }
    ],
    "name": "addConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function main(
  hre: HardhatRuntimeEnvironment,
  underlying: string,
): Promise<void> {
  const wallet: Wallet = await hre.getZkWallet();

  const oracleAddress: string = hre.getMainAddress("oracle");
  const oracle: ethers.Contract = new ethers.Contract(oracleAddress, ORACLE_ABI, wallet);

  const config: TokenConfig = getTokenConfig(hre, underlying);

  await oracle.addConfig(config);
}

task("oracleAddConfig", "Add a token config to the price oracle")
.addPositionalParam("underlying", "Symbol of the underlying token (optionally use the pool name as a prefix, e.g. degen:wbtc)")
.setAction(
  async (
    { underlying }: AddOracleConfigParams,
    hre: HardhatRuntimeEnvironment
  ) => {
    console.log("Adding token config...");

    await main(hre, underlying)
  }
);
