import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";
import dotenv from 'dotenv'
dotenv.config();
const { DEV_WALLET_PRIVATE_KEY, RINKEBY_INFURA_URL } = process.env

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  paths: {
    artifacts: '../next/src/artifacts',

  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: RINKEBY_INFURA_URL,
      accounts: [`0x${DEV_WALLET_PRIVATE_KEY}`]
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [`0x${DEV_WALLET_PRIVATE_KEY}`]
    }

  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
