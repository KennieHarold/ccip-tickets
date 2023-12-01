import hre from 'hardhat';
import { ethers } from 'hardhat';
import { ContractsConfig } from '../../constants';
import { updateEnv } from '../../utils';

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
