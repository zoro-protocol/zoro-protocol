import {
  CTokenConfig,
  DeployConfig,
  InterestRateConfig,
  PoolConfig
} from "./types";

const interestRateModels: InterestRateConfig[] = [
  {
    "name": "eth",
    "baseRatePerYear": "0.00",
    "multiplierPerYear": "0.04",
    "jumpMultiplierPerYear": "2",
    "kink": "0.85"
  },
  {
    "name": "stablecoin",
    "baseRatePerYear": "0.00",
    "multiplierPerYear": "0.05",
    "jumpMultiplierPerYear": "2.5",
    "kink": "0.80"
  },
  {
    "name": "wbtc",
    "baseRatePerYear": "0.00",
    "multiplierPerYear": "0.09",
    "jumpMultiplierPerYear": "2",
    "kink": "0.75"
  },
  {
    "name": "blue-chip-alt",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.15",
    "jumpMultiplierPerYear": "4",
    "kink": "0.60"
  },
  {
    "name": "degen:eth",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.08",
    "jumpMultiplierPerYear": "2",
    "kink": "0.85"
  },
  {
    "name": "degen:stablecoin",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.10",
    "jumpMultiplierPerYear": "2.5",
    "kink": "0.80"
  },
  {
    "name": "degen:token",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.2",
    "jumpMultiplierPerYear": "3",
    "kink": "0.50"
  },
  {
    "name": "degen:wbtc",
    "baseRatePerYear": "0.02",
    "multiplierPerYear": "0.18",
    "jumpMultiplierPerYear": "2",
    "kink": "0.75"
  }
];

const coreMarkets: CTokenConfig[] = [
  {
    "underlying": "dai",
    "interestRateModel": "stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "eth",
    "interestRateModel": "eth",
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
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "wbtc",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  }
];

const degenMarkets: CTokenConfig[] = [
  {
    "underlying": "aave",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "dai",
    "interestRateModel": "degen:stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "eth",
    "interestRateModel": "degen:eth",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "link",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "pepe",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "sol",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "uni",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "usdc",
    "interestRateModel": "degen:stablecoin",
    "collateralFactor": "0.825",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "usdt",
    "interestRateModel": "degen:stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "degen:wbtc",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  }
];

const testnetCoreMarkets: CTokenConfig[] = [
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

const testnetDegenMarkets: CTokenConfig[] = [
  {
    "underlying": "eth",
    "interestRateModel": "degen:eth",
    "collateralFactor": "0.8",
    "reserveFactor": "0.2"
  },
  {
    "underlying": "link",
    "interestRateModel": "degen:token",
    "collateralFactor": "0.4",
    "reserveFactor": "0.25"
  },
  {
    "underlying": "usdc",
    "interestRateModel": "degen:stablecoin",
    "collateralFactor": "0.825",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "usdt",
    "interestRateModel": "degen:stablecoin",
    "collateralFactor": "0.8",
    "reserveFactor": "0.1"
  },
  {
    "underlying": "wbtc",
    "interestRateModel": "degen:wbtc",
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
    "liquidationIncentive": "1.15",
    "markets": degenMarkets,
  }
];

const testnetPools: PoolConfig[] = [
  {
    "name": "core",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.1",
    "markets": testnetCoreMarkets,
  },
  {
    "name": "degen",
    "closeFactor": "0.5",
    "liquidationIncentive": "1.15",
    "markets": testnetDegenMarkets,
  }
];

export const config: DeployConfig = {
  interestRateModels,
  pools,
}

export const testnetConfig: DeployConfig = {
  interestRateModels,
  "pools": testnetPools,
}
