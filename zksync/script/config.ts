import { DeployConfig } from "./types";

export const config: DeployConfig = {
  "interestRateModels": [
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
  ],
  "pools": [
    {
      "name": "core",
      "closeFactor": "0.5",
      "liquidationIncentive": "1.1",
      "markets": [
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
      ]
    },
    {
      "name": "degen",
      "closeFactor": "0.5",
      "liquidationIncentive": "1.1",
      "markets": [
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
          "underlying": "mute",
          "interestRateModel": "altcoin",
          "collateralFactor": "0.4",
          "reserveFactor": "0.25"
        }
      ]
    }
  ]
}