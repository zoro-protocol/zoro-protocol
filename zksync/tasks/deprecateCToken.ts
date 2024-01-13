import * as ethers from "ethers";
import { deprecateCToken } from "../script/ctoken";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import { Wallet } from "zksync-web3";
import { DeprecateCTokenParams } from "../script/types";

export async function main(
  hre: HardhatRuntimeEnvironment,
  pool: string,
  cTokenKey: string
): Promise<void> {
  const wallet: Wallet = await hre.getZkWallet();

  const prefix = pool === "core" ? "" : `${pool}:`;

  const cTokenAddress: string = hre.getCTokenAddress(`${prefix}${cTokenKey}`);
  const cToken: ethers.Contract = await hre.ethers.getContractAt(
    "CToken",
    cTokenAddress,
    wallet
  );

  const comptrollerAddress: string = hre.getMainAddress(`${prefix}comptroller`);
  const comptroller: ethers.Contract = await hre.ethers.getContractAt(
    "Comptroller",
    comptrollerAddress,
    wallet
  );

  const isDeprecated: boolean = await comptroller.isDeprecated(cTokenAddress);

  if (isDeprecated) {
    console.log("CToken is already deprecated, exiting...");
  } else {
    await deprecateCToken(comptroller, cToken);
    console.log("Deprecation completed");
  }
}

task(
  "deprecateCToken",
  "Deprecate a CToken so it can no longer be used and is excluded from the pool"
)
  .addOptionalParam("pool", "Isolated pool name from config.ts, e.g. degen", "core")
  .addPositionalParam("cToken", "CToken name from zTokens.json, e.g. wbtc")
  .setAction(
    async (
      { pool, cToken }: DeprecateCTokenParams,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      console.log("Deprecating CToken and removing from the pool...");

      await main(hre, pool, cToken);
    }
  );

