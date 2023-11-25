import { ethers } from 'hardhat';
import { calculateQueryHash, packValidatorParams } from '../utils';
import { MockSigValidator, TicketVerifier } from '../typechain-types';
import { Query } from '../types';
import { Operators, ProofConfig } from '../constants';

describe('TicketVerifier Test Suite', async function () {
  let TicketVerifier: TicketVerifier;
  let Validator: MockSigValidator;

  describe('#Deployment', async function () {
    it('should deploy verifier contract', async function () {
      const Contract = await ethers.getContractFactory('TicketVerifier');
      TicketVerifier = await Contract.deploy();
      await TicketVerifier.waitForDeployment();
    });

    it('should deploy validator contract', async function () {
      const Contract = await ethers.getContractFactory('MockSigValidator');
      Validator = await Contract.deploy();
      await Validator.waitForDeployment();
    });
  });

  describe('#KYC Age Verifier', async function () {
    let query: Query;

    it('should calculate query hash', async function () {
      const requestId = 1;
      query = {
        requestId,
        schema: ProofConfig.schema.hash,
        claimPathKey: ProofConfig.schema.claimPathKeys.age,
        operator: Operators.GT,
        slotIndex: 0,
        value: [18, ...new Array(63).fill(0)],
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
    });

    it('should set zkp', async function () {
      const [verifierAddress, validatorAddress] = await Promise.all([
        TicketVerifier.getAddress(),
        Validator.getAddress()
      ]);

      const metadata = {
        id: ProofConfig.thid,
        typ: ProofConfig.metadataType,
        type: ProofConfig.metadataTypeURL,
        thid: ProofConfig.thid,
        body: {
          reason: ProofConfig.name,
          transaction_data: {
            contract_address: verifierAddress,
            method_id: ProofConfig.methodId,
            chain_id: 31337,
            network: 'hardhat'
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
                    $gt: 18
                  }
                },
                type: ProofConfig.schema.type
              }
            }
          ]
        }
      };
      await TicketVerifier.setZKPRequest(query.requestId, {
        metadata: JSON.stringify(metadata),
        validator: validatorAddress,
        data: packValidatorParams(query)
      });
    });
  });
});
