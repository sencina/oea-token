import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { NETWORK_URL, WALLET_PRIVATE_KEY } from "./env";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    network: {
      url: NETWORK_URL,
      accounts: [WALLET_PRIVATE_KEY!]
    }
  }
};

export default config;
