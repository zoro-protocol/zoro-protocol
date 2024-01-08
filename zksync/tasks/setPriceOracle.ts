import * as ethers from "ethers";
import { setPriceOracle } from "../script/comptroller";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import { Wallet } from "zksync-web3";
import { SetPriceOracleParams } from "../script/types";

export async function main(
  hre: HardhatRuntimeEnvironment,
  pool: string,
  oracleAddress: string,
): Promise<void> {
  const wallet: Wallet = await hre.getZkWallet();

  const prefix = pool === "core" ? "" : `${pool}:`;

  const comptrollerAddress: string = hre.getMainAddress(`${prefix}comptroller`);
  const comptroller: ethers.Contract = await hre.ethers.getContractAt(
    "Comptroller",
    comptrollerAddress,
    wallet
  );

  await setPriceOracle(comptroller, oracleAddress);
}

task(
  "setPriceOracle",
  "Set the price oracle for a Comptroller"
)
  .addOptionalParam("pool", "Isolated pool name from config.ts, e.g. degen", "core")
  .addPositionalParam("oracle", "Address of new oracle")
  .setAction(
    async (
      { pool, oracle }: SetPriceOracleParams,
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      console.log("Setting new oracle...");

      await main(hre, pool, oracle);
    }
  );
