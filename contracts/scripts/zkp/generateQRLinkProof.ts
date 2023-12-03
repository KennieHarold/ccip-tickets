import hre from 'hardhat';
import { ContractsConfig, HardhatNetworkToProofNetwork, ProofConfig } from '../../constants';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }

  const verifierAddress = ContractsConfig.verifier[networkParam].value || '';
  if (verifierAddress === '') {
    throw new Error('Verifier undefined');
  }

  const thresholdAgeToVerify = 18;
  const requestId = 1;
  const network = hre.config.networks[networkParam];

  const proof = {
    id: ProofConfig.thid,
    typ: ProofConfig.metadataType,
    type: ProofConfig.metadataTypeURL,
    thid: ProofConfig.thid,
    body: {
      reason: ProofConfig.name,
      transaction_data: {
        contract_address: verifierAddress,
        method_id: ProofConfig.methodId,
        chain_id: network.chainId,
        network: HardhatNetworkToProofNetwork[networkParam]
      },
      scope: [
        {
          id: requestId,
          circuitId: ProofConfig.circuitId,
          query: {
            allowedIssuers: ['*'],
            context: ProofConfig.schema.url,
            credentialSubject: {
              age: {
                $gt: thresholdAgeToVerify
              }
            },
            type: ProofConfig.schema.type
          }
        }
      ]
    }
  };

  const base64String = btoa(JSON.stringify(proof));
  console.log(JSON.stringify(proof));
  console.log(`iden3comm://\?i_m=${base64String}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
