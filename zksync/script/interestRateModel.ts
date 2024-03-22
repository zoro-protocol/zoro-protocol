import { ethers } from "ethers";
import deployContract from "./contract";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import {
  DeployConfig,
  InterestRateArgs,
  InterestRateCollection,
  InterestRateConfig
} from "./types";

export async function deployInterestRate(deployer: Deployer, config: InterestRateConfig): Promise<ethers.Contract> {
  const { baseRatePerYear, multiplierPerYear, jumpMultiplierPerYear, kink } = config;

  const owner: string = deployer.hre.getMainAddress("admin")

  const interestRateArgs: InterestRateArgs = [
    ethers.utils.parseEther(baseRatePerYear),
    ethers.utils.parseEther(multiplierPerYear),
    ethers.utils.parseEther(jumpMultiplierPerYear),
    ethers.utils.parseEther(kink),
    owner
  ];

  const jumpRate: ethers.Contract = await deployContract(
    deployer,
    "JumpRateModelV2",
    interestRateArgs
  );

  return jumpRate;
}

export async function deployInterestRatesAll(deployer: Deployer, config: DeployConfig): Promise<InterestRateCollection> {
  const interestRates: InterestRateCollection = {};

  // Must complete txs sequentially for correct nonce
  for (const interestRateConfig of config.interestRateModels) {
    const { name } = interestRateConfig;

    let interestRate: ethers.Contract;

    try {
      const address = deployer.hre.getCTokenAddress(`interest:${name}`);
      interestRate = await deployer.hre.ethers.getContractAt("JumpRateModelV2", address, deployer.zkWallet);

    } catch {
      interestRate = await deployInterestRate(deployer, interestRateConfig);
      deployer.hre.recordMainAddress(`interest:${name}`, interestRate.address);
    }

    interestRates[name] = interestRate;
  }

  return interestRates;
}

export async function getInterestRatesAll(deployer: Deployer, config: DeployConfig): Promise<InterestRateCollection> {
  const interestRates: InterestRateCollection = {};
  for (const interestRateConfig of config.interestRateModels) {
    const { name } = interestRateConfig;

    const interestRate: string = deployer.hre.getMainAddress(`interest:${name}`);
    interestRates[name] = await deployer.hre.ethers.getContractAt("JumpRateModelV2", interestRate, deployer.zkWallet);
  }

  return interestRates;
}
