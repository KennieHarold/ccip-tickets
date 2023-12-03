import hre from 'hardhat';
import { ContractsConfig } from '../../constants';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }
  const contractAddress = ContractsConfig.verifier[networkParam].value;
  console.log(`Verifying contract on "${networkParam}" with address ${contractAddress}`);

  await hre.run('verify:verify', {
    address: contractAddress,
    contract: 'contracts/TicketVerifier.sol:TicketVerifier',
    constructorArguments: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
