import { ethers } from 'hardhat';
import { poseidon } from '@iden3/js-crypto';
import { SchemaHash } from '@iden3/js-iden3-core';
import { prepareCircuitArrayValues } from '@0xpolygonid/js-sdk';
import { Query } from './types';
import Web3 from 'web3';

export function packValidatorParams(query: Query, allowedIssuers: number[] = []) {
  const web3 = new Web3(Web3.givenProvider);
  return web3.eth.abi.encodeParameter(
    {
      CredentialAtomicQuery: {
        schema: 'uint256',
        claimPathKey: 'uint256',
        operator: 'uint256',
        slotIndex: 'uint256',
        value: 'uint256[]',
        queryHash: 'uint256',
        allowedIssuers: 'uint256[]',
        circuitIds: 'string[]',
        skipClaimRevocationCheck: 'bool',
        claimPathNotExists: 'uint256'
      }
    },
    {
      schema: query.schema,
      claimPathKey: query.claimPathKey,
      operator: query.operator,
      slotIndex: query.slotIndex,
      value: query.value,
      queryHash: query.queryHash,
      allowedIssuers: allowedIssuers,
      circuitIds: query.circuitIds,
      skipClaimRevocationCheck: query.skipClaimRevocationCheck,
      claimPathNotExists: query.claimPathNotExists
    }
  );
}

export function calculateQueryHash(
  values: bigint[],
  schema: string,
  slotIndex: number,
  operator: number,
  claimPathKey: string,
  claimPathNotExists: number
) {
  const expValue = prepareCircuitArrayValues(values, 64);
  const valueHash = poseidon.spongeHashX(expValue, 6);
  const schemaHash = coreSchemaFromStr(schema);
  const queryHash = poseidon.hash([
    schemaHash.bigInt(),
    BigInt(slotIndex),
    BigInt(operator),
    BigInt(claimPathKey),
    BigInt(claimPathNotExists),
    valueHash
  ]);
  return queryHash;
}

function coreSchemaFromStr(schemaIntString: string) {
  const schemaInt = BigInt(schemaIntString);
  return SchemaHash.newSchemaHashFromInt(schemaInt);
}

export function convertStringToBigNumber() {}
