import hre from 'hardhat';
import { ethers } from 'hardhat';
import { updateEnv } from '../utils';
import { ContractsConfig } from '../../constants';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }
  const verifierContract = 'ERC20Verifier';
  const verifierName = 'ERC20zkAirdrop';
  const verifierSymbol = 'zkERC20';

  const ERC20Verifier = await ethers.getContractFactory(verifierContract);
  const erc20Verifier = await ERC20Verifier.deploy(verifierName, verifierSymbol);
  await erc20Verifier.waitForDeployment();
  const erc20VerifierAddress = await erc20Verifier.getAddress();

  updateEnv(ContractsConfig.sampleERC20Verifier[networkParam].key, erc20VerifierAddress);
  console.log(`ERC20Verifier deployed to ${erc20VerifierAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
