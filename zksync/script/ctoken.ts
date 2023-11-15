import { ethers } from "ethers";
import { deployCErc20 } from "./cerc20";
import { deployCEther } from "./cether";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { TransactionResponse } from "ethers/providers";
import {
  CTokenCollection,
  CTokenConfig,
  InterestRateCollection
} from "./types";

export async function deployCTokenAll(
  deployer: Deployer,
  comptroller: ethers.Contract,
  interestRates: InterestRateCollection,
  cTokenConfigs: CTokenConfig[]
): Promise<CTokenCollection> {
  const cTokens: CTokenCollection = {};

  // Must complete txs sequentially for correct nonce
  for (const config of cTokenConfigs) {
    const { underlying, interestRateModel } = config;
    const underlyingAddress: string = deployer.hre.getUnderlyingToken(underlying);

    let cToken: ethers.Contract;

    if (underlying === "eth") {
      cToken = await deployCEther(
        deployer,
        comptroller.address,
        interestRates[interestRateModel].address
      );
    } else {
      cToken = await deployCErc20(
        deployer,
        underlyingAddress,
        comptroller.address,
        interestRates[interestRateModel].address
      );
    }

    cTokens[underlying] = cToken;
  }

  return cTokens;
}

export async function addCTokenToMarket(
  comptroller: ethers.Contract,
  cToken: ethers.Contract,
  config: CTokenConfig
): Promise<void> {
  console.log(`Adding ${cToken.address} to comptroller`);

  const addMarketTx: TransactionResponse = await comptroller._supportMarket(cToken.address);
  await addMarketTx.wait();

  const collateralFactor: ethers.BigNumber = ethers.utils.parseEther(config.collateralFactor);

  // If the ctoken isn't a supported market, it will fail to set the collateral factor
  // If the ctoken does not have an oracle price, it will fail to set the collateral factor
  const collateralTx: TransactionResponse = await comptroller._setCollateralFactor(
    cToken.address,
    collateralFactor
  );
  await collateralTx.wait();

  const reserveFactor: ethers.BigNumber = ethers.utils.parseEther(config.reserveFactor);
  const reserveTx: TransactionResponse = await cToken._setReserveFactor(reserveFactor);
  await reserveTx.wait();
}

export async function deprecateCToken(
  comptroller: ethers.Contract,
  cToken: ethers.Contract
): Promise<void> {
  const collateralFactor: ethers.BigNumber = ethers.BigNumber.from("0");
  const collateralTx: TransactionResponse = await comptroller._setCollateralFactor(cToken.address, collateralFactor);
  await collateralTx.wait();

  const borrowPauseTx: TransactionResponse = await comptroller._setBorrowPaused(cToken.address, true);
  await borrowPauseTx.wait();

  const reserveFactor: ethers.BigNumber = ethers.utils.parseEther("1");
  const reserveTx: TransactionResponse = await cToken._setReserveFactor(reserveFactor);
  await reserveTx.wait();
}
