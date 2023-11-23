import { ethers } from 'hardhat';
import {
  InvokeRequestMetadataTypeURL,
  Operators,
  SchemaClaimPathKeys,
  SchemaHash,
  SchemaType,
  SchemaUrl
} from './constants';
import { calculateQueryHash, packValidatorParams } from './utils';
import { MockSigValidator, TicketVerifier } from '../typechain-types';
import { Query } from './types';

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
        schema: SchemaHash,
        claimPathKey: SchemaClaimPathKeys.age,
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

      const invokeRequestMetadata = {
        id: 'test-id',
        typ: 'application/iden3comm-plain-json',
        type: InvokeRequestMetadataTypeURL,
        thid: 'test-id',
        body: {
          reason: 'tourist ticket mint',
          transaction_data: {
            contract_address: verifierAddress,
            method_id: 'b68967e2',
            chain_id: 31337,
            network: 'hardhat'
          },
          scope: [
            {
              id: query.requestId,
              circuitId: query.circuitIds[0],
              query: {
                allowedIssuers: ['*'],
                context: SchemaUrl,
                credentialSubject: {
                  age: {
                    $gt: 18
                  }
                },
                type: SchemaType
              }
            }
          ]
        }
      };
      await TicketVerifier.setZKPRequest(query.requestId, {
        metadata: JSON.stringify(invokeRequestMetadata),
        validator: validatorAddress,
        data: packValidatorParams(query)
      });
    });
  });
});
