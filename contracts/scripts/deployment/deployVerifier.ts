import hre from 'hardhat';
import { ethers } from 'hardhat';
import { ContractsConfig } from '../../constants';
import { updateEnv } from '../../utils';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }

  const Verifier = await ethers.getContractFactory('TicketVerifier');
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();

  updateEnv(ContractsConfig.verifier[networkParam].key, verifierAddress);
  console.log(`Verifier deployed to ${verifierAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
