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

export async function safeDeployCToken(
  deployer: Deployer,
  comptroller: ethers.Contract,
  underlying: ethers.Contract,
  interestRate: string
): Promise<ethers.Contract> {
  const cToken: ethers.Contract = await deployCToken(deployer, comptroller.address, underlying.address, interestRate);
  await comptroller._supportMarket(cToken.address);

  const exchangeRate: ethers.BigNumber = await cToken.exchangeRateCurrent();
  const mintAmount: ethers.BigNumber = exchangeRate;

  const underlyingBalance: ethers.BigNumber = await underlying.balanceOf(deployer.zkWallet.address);
  if (underlyingBalance.lt(mintAmount)) {
    throw new Error("Insufficient underlying balance to mint CToken");
  }

  await cToken.mint(mintAmount);

  const cTokenBalance: ethers.BigNumber = await cToken.balanceOf(deployer.zkWallet.address);
  const totalSupply: ethers.BigNumber = await cToken.totalSupply();

  if (cTokenBalance.lt(1) || totalSupply.lt(1)) {
    throw new Error("Failed to mint 1 wei of CToken");
  }

  await cToken.transfer(ethers.constants.AddressZero, cTokenBalance);

  return cToken;
}

export async function deployCToken(
  deployer: Deployer,
  comptroller: string,
  underlying: string,
  interestRate: string
): Promise<ethers.Contract> {
  let cToken: ethers.Contract;

  if (underlying === "eth") {
    cToken = await deployCEther(
      deployer,
      comptroller,
      interestRate
    );
  } else {
    const underlyingAddress: string = deployer.hre.getUnderlyingToken(underlying);

    cToken = await deployCErc20(
      deployer,
      underlyingAddress,
      comptroller,
      interestRate
    );
  }

  return cToken;
}

export async function deployCTokenAll(
  deployer: Deployer,
  comptroller: ethers.Contract,
  interestRates: InterestRateCollection,
  cTokenConfigs: CTokenConfig[]
): Promise<CTokenCollection> {
  const cTokens: CTokenCollection = {};

  // Must complete txs sequentially for correct nonce
  for (const config of cTokenConfigs) {
    const { underlying: underlyingAddress, interestRateModel } = config;

    const underlying: ethers.Contract = await deployer.hre.ethers.getContractAt("EIP20Interface", underlyingAddress, deployer.zkWallet);

    const cToken: ethers.Contract = await safeDeployCToken(
      deployer,
      comptroller,
      underlying,
      interestRates[interestRateModel].address
    );

    cTokens[underlyingAddress] = cToken;
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

  console.log(`Setting collateral factor to ${config.collateralFactor}`);

  const collateralFactor: ethers.BigNumber = ethers.utils.parseEther(config.collateralFactor);

  // If the ctoken isn't a supported market, it will fail to set the collateral factor
  // If the ctoken does not have an oracle price, it will fail to set the collateral factor
  const collateralTx: TransactionResponse = await comptroller._setCollateralFactor(
    cToken.address,
    collateralFactor
  );
  await collateralTx.wait();

  console.log(`Setting reserve factor to ${config.reserveFactor}`);

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
