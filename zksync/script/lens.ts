import { ethers } from "ethers";
import deployContract from "./contract";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export async function deployLens(deployer: Deployer): Promise<ethers.Contract> {
  let lens: ethers.Contract;

  try {
    const address: string = deployer.hre.getMainAddress("zoroLens");
    lens = await deployer.hre.ethers.getContractAt("CompoundLens", address, deployer.zkWallet);
    return lens;
  } catch {
    lens = await deployContract(deployer, "CompoundLens", [], false);
    deployer.hre.recordMainAddress("zoroLens", lens.address);
  }

  return lens;
}
