import { ethers } from "ethers";
import { deployTestToken } from "./testToken";
import { deployTestOracle, setTestOraclePrice } from "./simpleOracle";
import { deployUnitroller } from "./comptroller";
import { deployInterestRatesAll } from "./interestRateModel";
import { deployLens } from "./lens";
import { deployMaximillion } from "./maximillion";
import { addCTokenToMarket, deployCTokenAll } from "./ctoken";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import {
  DeployConfig,
  DeployReturn,
  CTokenCollection,
  CTokenConfig,
  InterestRateCollection,
  PoolConfig
} from "./types";

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

async function deployIsolatedPool(
  deployer: Deployer,
  oracle: ethers.Contract,
  interestRates: InterestRateCollection,
  config: PoolConfig
): Promise<DeployReturn> {
  const prefix = config.name === "core" ? "" : `${config.name}:`;

  const comptroller: ethers.Contract = await deployUnitroller(deployer, oracle.address, config);
  deployer.hre.recordMainAddress(`${prefix}comptroller`, comptroller.address);

  const cTokens: CTokenCollection = await deployCTokenAll(deployer, comptroller, oracle, interestRates, config.markets);
  for (const [name, cToken] of Object.entries(cTokens)) {
    if (name === "eth") {
      const maximillion = await deployMaximillion(deployer, cToken);
      deployer.hre.recordMainAddress(`${prefix}maximillion`, maximillion.address);
    }
    deployer.hre.recordCTokenAddress(`${prefix}${name}`, cToken.address);
  }

  return { comptroller, cTokens };
}

export async function deployCore(
  deployer: Deployer,
  oracle: ethers.Contract,
  config: DeployConfig
): Promise<DeployReturn[]> {
  const interestRates: InterestRateCollection = await deployInterestRatesAll(deployer, config);

  await deployLens(deployer);

  const poolDeployAll: DeployReturn[] = [];

  // Must complete txs sequentially for correct nonce
  for (const poolConfig of config.pools) {
    const poolDeploy: DeployReturn = await deployIsolatedPool(deployer, oracle, interestRates, poolConfig);
    poolDeployAll.push(poolDeploy);
  }

  return poolDeployAll;
}

export async function deployTestInterestRatePool(
  deployer: Deployer,
  config: DeployConfig
): Promise<void> {
  await deployTestToken(deployer);

  const priceOracle: ethers.Contract = await deployTestOracle(deployer);

  const deployments: DeployReturn[] = await deployCore(deployer, priceOracle, config);

  for (const i in deployments) {
    const { comptroller, cTokens }: DeployReturn = deployments[i];

    const markets: CTokenConfig[] = config.pools[i].markets;

    // Must complete txs sequentially for correct nonce
    for (const cTokenConfig of markets) {
      const { underlying }: CTokenConfig = cTokenConfig;

      // If price is zero, the comptroller will fail to set the collateral factor
      await setTestOraclePrice(priceOracle, cTokens[underlying].address);
      await addCTokenToMarket(comptroller, cTokens[underlying], cTokenConfig);
    }
  }
}

export async function deployInterestRatePool(
  deployer: Deployer,
  config: DeployConfig
): Promise<void> {
  const oracleAddress: string = deployer.hre.getMainAddress("oracle");
  const oracle: ethers.Contract = new ethers.Contract(oracleAddress, ORACLE_ABI, deployer.zkWallet);

  await deployCore(deployer, oracle, config);
}
