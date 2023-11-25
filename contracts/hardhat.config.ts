import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.16',
  networks: {
    polygon_mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ''],
      chainId: 80001
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_SCAN_API_KEY || ''
    }
  }
};

export default config;
