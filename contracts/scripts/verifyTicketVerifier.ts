import hre from 'hardhat';
import { contractAddresses } from '../config/default';

async function main() {
  const network = hre.hardhatArguments.network;

  if (!network) {
    throw new Error('Network undefined');
  }

  console.log(`Verifying contracts on ${network}...`);

  await hre.run('verify:verify', {
    address: contractAddresses.ticketVerifier[network],
    contract: 'contracts/TicketVerifier.sol:TicketVerifier',
    constructorArguments: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
