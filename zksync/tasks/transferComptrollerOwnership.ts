import * as ethers from "ethers";
import { config } from "../script/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import { Wallet } from "zksync-web3";

export async function main(hre: HardhatRuntimeEnvironment, newOwner: string): Promise<void> {
  const wallet: Wallet = await hre.getZkWallet();

  for (const poolConfig of config.pools) {
    const pool: string = poolConfig.name;
    const prefix = pool === "core" ? "" : `${pool}:`;
    const comptrollerAddress: string = hre.getMainAddress(`${prefix}comptroller`);
    const comptroller: ethers.Contract = await hre.ethers.getContractAt(
      "Comptroller",
      comptrollerAddress,
      wallet
    );

    const owner = await comptroller.admin();

    if (owner.toLowerCase() !== newOwner.toLowerCase()) {
      const tx = await comptroller._setPendingAdmin(newOwner);
      await tx.wait();

      console.log(`New pending admin for ${pool} comptroller`);
      console.log("Do not forget to accept the new pending admin with _acceptAdmin()");
    }
  }
}

task(
  "transferComptrollerOwnership",
  "Transfer ownership of comptroller to a new owner"
)
  .addPositionalParam("newOwner", "Address of the new owner for the contracts")
  .setAction(
    async (
      { newOwner }: { newOwner: string },
      hre: HardhatRuntimeEnvironment
    ): Promise<void> => {
      await main(hre, newOwner);
    }
  );
