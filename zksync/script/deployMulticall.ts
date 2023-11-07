import { ethers } from "ethers";
import { getChainId } from "./utils";
import deployContract from "./deployContract";
import { recordMainAddress } from "./deployAddresses";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export async function deployMulticall(deployer: Deployer): Promise<ethers.Contract> {
  const chainId: number = getChainId(deployer.hre);

  const multicall: ethers.Contract = await deployContract(deployer, "Multicall3", []);
  recordMainAddress(chainId, "multicall", multicall.address);

  return multicall;
}
