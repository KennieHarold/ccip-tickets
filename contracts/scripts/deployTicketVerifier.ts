import { ethers } from 'hardhat';

async function main() {
  const TicketVerifier = await ethers.getContractFactory('TicketVerifier');
  const ticketVerifier = await TicketVerifier.deploy();
  await ticketVerifier.waitForDeployment();

  console.log(`TicketVerifier deployed to ${await ticketVerifier.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
