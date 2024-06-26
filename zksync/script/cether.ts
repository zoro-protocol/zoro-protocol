import { ethers } from "ethers";
import deployContract from "./contract";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { CEtherConstructorArgs } from "../script/types";

export async function deployCEther(
  deployer: Deployer,
  comptrollerAddress: string,
  interestRateModel: string,
): Promise<ethers.Contract> {
  const underlyingDecimals = 18;
  const decimals: number = 8;
  const initialExchangeRateDecimals = underlyingDecimals + 18 - decimals;
  const initialExchangeRateMantissa: ethers.BigNumber = ethers.utils.parseUnits("0.02", initialExchangeRateDecimals);
  const name: string = "Zoro Ether";
  const symbol: string = "zETH";
  const admin: string = deployer.zkWallet.address;
  const cetherArgs: CEtherConstructorArgs = [
    comptrollerAddress,
    interestRateModel,
    initialExchangeRateMantissa,
    name,
    symbol,
    decimals,
    admin
  ];
  const cether: ethers.Contract = await deployContract(deployer, "CEther", cetherArgs);

  return cether;
}
