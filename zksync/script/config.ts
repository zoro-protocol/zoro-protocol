import {
  CTokenConfig,
  DeployConfig,
  InterestRateConfig,
  PoolConfig
} from "./types";

const interestRateModels: InterestRateConfig[] = [
  {
    "name": "eth",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.04",
    "jumpMultiplierPerYear": "2",
    "kink": "0.85"
  },
  {
    "name": "stablecoin",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.05",
    "jumpMultiplierPerYear": "2.5",
    "kink": "80"
  },
  {
    "name": "wbtc",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.09",
    "jumpMultiplierPerYear": "2",
    "kink": "75"
  },
  {
    "name": "blue-chip-alt",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.15",
    "jumpMultiplierPerYear": "4",
    "kink": "60"
  },
  {
    "name": "altcoin",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.2",
    "jumpMultiplierPerYear": "3",
    "kink": "0.50"
  }
];

const coreMarkets: CTokenConfig[] = [
  {
    "underlying": "eth",
    "interestRateModel": "eth",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "wbtc",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "usdc",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.825",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "usdt",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  }
];

const degenMarkets: CTokenConfig[] = [
  {
    "underlying": "aave",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "doge",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "eth",
    "interestRateModel": "eth",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "link",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "pepe",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "sol",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "uni",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "usdc",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.825",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "usdt",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "wbtc",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  }
]

const testnetDegenMarkets: CTokenConfig[] = [
  {
    "underlying": "eth",
    "interestRateModel": "eth",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "link",
    "interestRateModel": "altcoin",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "usdc",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.825",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "usdt",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "wbtc",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  }
];

const pools: PoolConfig[] = [
  {
    "name": "core",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.1",
    "markets": coreMarkets,
  },
  {
    "name": "degen",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.1",
    "markets": degenMarkets,
  }
];

const testnetPools: PoolConfig[] = [
  {
    "name": "core",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.1",
    "markets": coreMarkets,
  },
  {
    "name": "degen",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.1",
    "markets": testnetDegenMarkets,
  }
];

export const config: DeployConfig = {
  interestRateModels,
  pools,
}

export const testnetConfig: DeployConfig = {
  interestRateModels,
  testnetPools,
}
