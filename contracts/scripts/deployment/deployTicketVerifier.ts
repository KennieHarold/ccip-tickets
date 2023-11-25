import hre from 'hardhat';
import fs from 'fs';
import { ethers } from 'hardhat';
import { ContractsConfig } from '../../constants';

function updateEnv(key: string, value: string) {
  const envFilePath = './.env';
  const envContents = fs.readFileSync(envFilePath, 'utf-8');
  const updatedEnvKey = envContents.replace(new RegExp(`^${key}=.*`, 'gm'), `${key}=${value}`);
  fs.writeFileSync(envFilePath, updatedEnvKey);
}

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }

  const TicketVerifier = await ethers.getContractFactory('TicketVerifier');
  const ticketVerifier = await TicketVerifier.deploy();
  await ticketVerifier.waitForDeployment();
  const ticketVerifierAddress = await ticketVerifier.getAddress();

  updateEnv(ContractsConfig.ticketVerifier[networkParam].key, ticketVerifierAddress);
  console.log(`TicketVerifier deployed to ${ticketVerifierAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
