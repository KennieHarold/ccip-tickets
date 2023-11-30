import hre from 'hardhat';
import { ContractsConfig } from '../../constants';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }
  const contractAddress = ContractsConfig.sampleERC20Verifier[networkParam].value;
  console.log(`Verifying contract on "${networkParam}" with address ${contractAddress}`);

  const verifierName = 'ERC20zkAirdrop';
  const verifierSymbol = 'zkERC20';

  await hre.run('verify:verify', {
    address: contractAddress,
    contract: 'contracts/sample/ERC20Verifier.sol:ERC20Verifier',
    constructorArguments: [verifierName, verifierSymbol]
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
