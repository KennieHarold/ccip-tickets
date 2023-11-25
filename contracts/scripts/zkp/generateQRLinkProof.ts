import hre from 'hardhat';
import {
  ContractsConfig,
  HardhatNetworkToProofNetwork,
  Operators,
  ProofConfig
} from '../../constants';
import { calculateQueryHash } from '../../utils';

async function main() {
  const networkParam = hre.hardhatArguments.network;
  if (!networkParam) {
    throw new Error('Network undefined');
  }

  const verifierAddress = ContractsConfig.ticketVerifier[networkParam].value || '';
  if (verifierAddress === '') {
    throw new Error('Verifier undefined');
  }

  const thresholdAgeToVerify = 18;
  const requestId = 1;

  const query = {
    requestId,
    schema: ProofConfig.schema.hash,
    claimPathKey: ProofConfig.schema.claimPathKeys.age,
    operator: Operators.GT,
    slotIndex: 0,
    value: [thresholdAgeToVerify, ...new Array(63).fill(0)],
    circuitIds: ['credentialAtomicQuerySigV2OnChain'],
    skipClaimRevocationCheck: false,
    claimPathNotExists: 0,
    queryHash: ''
  };
  query.queryHash = calculateQueryHash(
    query.value,
    query.schema,
    query.slotIndex,
    query.operator,
    query.claimPathKey,
    query.claimPathNotExists
  ).toString();

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
          id: query.requestId,
          circuitId: query.circuitIds[0],
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
  console.log(`iden3comm://\?i_m=${base64String}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
