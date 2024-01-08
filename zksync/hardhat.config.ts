import "dotenv/config";

import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-ethers";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";
import "@zoroprotocol/hardhat-zksync-web3";
import "./script/addresses";

import richWallets from "./rich-wallets.json";

const { ETH_KEYSTORE = "" } = process.env;

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.13", // Uses latest available in https://github.com/matter-labs/zksolc-bin/
      settings: {}
  },

  defaultNetwork: "zkSyncLocal",

  networks: {
    zkSyncLocal: {
      url: "http://localhost:3050",
      ethNetwork: "http://localhost:8545",
      chainId: 270,
      zksync: true,
      zkWallet: {
        privateKey: richWallets[0].privateKey
      }
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli", // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      chainId: 280,
      zksync: true,
      verifyURL:
        "https://zksync2-testnet-explorer.zksync.dev/contract_verification", // Verification endpoint
      zkWallet: {
        keystore: ETH_KEYSTORE
      }
    }
  },

  solidity: {
    version: "0.8.10"
  }
};

import "./tasks/addCTokenToMarket";
import "./tasks/deployCToken";
import "./tasks/deprecateCToken";
import "./tasks/setPriceOracle";
import "./tasks/deployTestToken";

export default config;
