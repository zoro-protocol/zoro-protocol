import { ethers } from "ethers";

export interface DeployConfig {
  interestRateModels: InterestRateConfig[];
  pools: PoolConfig[];
}

export interface InterestRateConfig {
  name: string;
  baseRatePerYear: string;
  multiplierPerYear: string;
  jumpMultiplierPerYear: string;
  kink: string;
}

export interface PoolConfig {
  name: string;
  closeFactor: string;
  liquidationIncentive: string;
  markets: CTokenConfig[];
}

export interface CTokenConfig {
  underlying: string;
  interestRateModel: string;
  collateralFactor: string;
  reserveFactor: string;
}

export interface AddressConfig {
  [contract: string]: { [chainId: number]: string };
}

export interface PoolTaskParams {
  pool: string;
}

export interface SetPriceOracleParams extends PoolTaskParams {
  oracle: string;
}

export interface CTokenTaskParams extends PoolTaskParams {
  cToken: string;
}

export interface DeployCTokenParams extends CTokenTaskParams {}
export interface AddCTokenToMarketParams extends CTokenTaskParams {}

export interface DeprecateCTokenParams {
  cToken: string;
}

export interface VerifyContractParams {
  contractName: string;
  address: string;
}

export interface ContractCollection {
  [name: string]: ethers.Contract;
}

export interface InterestRateCollection extends ContractCollection {}
export interface CTokenCollection extends ContractCollection {}

export type Erc20ConstructorArgs = [
  initialAmount: ethers.BigNumber,
  tokenName: string,
  decimalUnits: number,
  tokenSymbol: string
];

export type CErc20ImmutableConstructorArgs = [
  underlying: string,
  comptroller: string,
  interestRateModel: string,
  initialExchangeRateMantissa: ethers.BigNumber,
  name: string,
  symbol: string,
  decimals: number,
  admin: string,
];

export type CEtherConstructorArgs = [
  comptroller: string,
  interestRateModel: string,
  initialExchangeRateMantissa: ethers.BigNumber,
  name: string,
  symbol: string,
  decimals: number,
  admin: string,
];

export type InterestRateArgs = [
  ethers.BigNumber,
  ethers.BigNumber,
  ethers.BigNumber,
  ethers.BigNumber,
  string
];

export type DeployReturn = {
  comptroller: ethers.Contract,
  cTokens: CTokenCollection
};
