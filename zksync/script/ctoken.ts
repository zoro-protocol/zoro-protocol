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

async function safeDeployCEther(
  deployer: Deployer,
  comptroller: ethers.Contract,
  interestRate: string
): Promise<ethers.Contract> {
  const cToken: ethers.Contract = await deployCEther(
    deployer,
    comptroller.address,
    interestRate
  );

  console.log(`Supporting CEther with Comptroller`);
  await comptroller._supportMarket(cToken.address);

  const exchangeRate: ethers.BigNumber = await cToken.callStatic.exchangeRateCurrent();
  const mintAmount: ethers.BigNumber = exchangeRate.div(ethers.constants.WeiPerEther);

  const underlyingBalance: ethers.BigNumber = await deployer.zkWallet.getBalance();
  if (underlyingBalance.lt(mintAmount)) {
    throw new Error("Insufficient underlying balance to mint CToken");
  }

  console.log(`Minting with ${mintAmount} wei of eth`);

  await cToken.mint({ value: mintAmount });

  return cToken;
}

async function safeDeployCErc20(
  deployer: Deployer,
  underlying: ethers.Contract,
  comptroller: ethers.Contract,
  interestRate: string
): Promise<ethers.Contract> {
  const cToken: ethers.Contract = await deployCErc20(
    deployer,
    underlying.address,
    comptroller.address,
    interestRate
  );

  console.log(`Supporting ${underlying.address} with Comptroller`);
  await comptroller._supportMarket(cToken.address);

  const exchangeRate: ethers.BigNumber = await cToken.callStatic.exchangeRateCurrent();
  const mintAmount: ethers.BigNumber = exchangeRate.div(ethers.constants.WeiPerEther);

  const underlyingBalance: ethers.BigNumber = await underlying.balanceOf(deployer.zkWallet.address);
  if (underlyingBalance.lt(mintAmount)) {
    throw new Error("Insufficient underlying balance to mint CToken");
  }

  console.log(`Minting with ${mintAmount} wei of ${underlying.address}`);

  await underlying.approve(cToken.address, mintAmount);
  await cToken.mint(mintAmount);

  return cToken;
}

export async function deployCToken(
  deployer: Deployer,
  comptroller: ethers.Contract,
  underlyingSymbol: string,
  interestRate: string
): Promise<ethers.Contract> {
  let cToken: ethers.Contract;

  if (underlyingSymbol === "eth") {
    cToken = await safeDeployCEther(
      deployer,
      comptroller,
      interestRate
    );
  } else {
    const underlyingAddress: string = deployer.hre.getUnderlyingToken(underlyingSymbol);
    const underlying: ethers.Contract = await deployer.hre.ethers.getContractAt("EIP20Interface", underlyingAddress, deployer.zkWallet);

    cToken = await safeDeployCErc20(
      deployer,
      underlying,
      comptroller,
      interestRate
    );
  }

  const cTokenBalance: ethers.BigNumber = await cToken.balanceOf(deployer.zkWallet.address);

  console.log(`Minted ${cTokenBalance} of ${cToken.address}`);

  const totalSupply: ethers.BigNumber = await cToken.totalSupply();

  if (cTokenBalance.lt(1) || totalSupply.lt(1)) {
    throw new Error("Failed to mint 1 wei of CToken");
  }

  console.log(`Burning ${cTokenBalance} of ${cToken.address}`);

  await cToken.transfer(ethers.constants.AddressZero, cTokenBalance);

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
    const { underlying: underlyingSymbol, interestRateModel } = config;

    const cToken: ethers.Contract = await deployCToken(
      deployer,
      comptroller,
      underlyingSymbol,
      interestRates[interestRateModel].address
    );

    cTokens[underlyingSymbol] = cToken;
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
