import hre, { ethers, upgrades } from 'hardhat';
import { ContractsConfig } from '../../constants';
import { updateEnv } from '../../utils';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }

  const stateAddress = ContractsConfig.state[networkParam].value;
  const verifierAddress = ContractsConfig.verifier[networkParam].value;
  const Validator = await ethers.getContractFactory('CredentialAtomicQuerySigValidator');
  const validatorContractProxy = await upgrades.deployProxy(Validator, [
    verifierAddress,
    stateAddress
  ]);

  await validatorContractProxy.waitForDeployment();
  const validatorContractProxyAddress = await validatorContractProxy.getAddress();

  updateEnv(ContractsConfig.validator[networkParam].key, validatorContractProxyAddress);
  console.log(`CredentialAtomicQuerySigValidator deployed to: ${validatorContractProxyAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
