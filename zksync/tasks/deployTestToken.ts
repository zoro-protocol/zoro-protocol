import * as ethers from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Wallet } from "zksync-web3";
import deployContract from "../script/contract";
import { DeployTestTokenParams, Erc20ConstructorArgs } from "../script/types";

async function main(
  hre: HardhatRuntimeEnvironment,
  underlying: string,
): Promise<void> {
  const wallet: Wallet = await hre.getZkWallet();

  const deployer: Deployer = new Deployer(hre, wallet);

  const initialAmount: ethers.BigNumber = ethers.utils.parseEther("10000000");
  const tokenName: string = `Test ${underlying.toUpperCase()}`;
  const decimalUnits: number = 18;
  const tokenSymbol: string = underlying.toUpperCase();
  const testUsdArgs: Erc20ConstructorArgs = [
    initialAmount,
    tokenName,
    decimalUnits,
    tokenSymbol
  ];

  const testToken: ethers.Contract = await deployContract(
    deployer,
    "contracts/core/tests/Contracts/ERC20.sol:StandardToken",
    testUsdArgs
  );

  hre.recordTokenAddress(underlying, testToken.address);
}

task("deployTestToken", "Deploy a test underlying token")
.addPositionalParam("underlying", "Symbol of the underlying token")
.setAction(
  async (
    { underlying }: DeployTestTokenParams,
    hre: HardhatRuntimeEnvironment
  ) => {
    console.log("Deploying a test token...");

    await main(hre, underlying)
  }
);
