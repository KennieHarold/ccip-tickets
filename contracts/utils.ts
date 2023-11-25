import { ethers } from 'hardhat';
import { poseidon } from '@iden3/js-crypto';
import { SchemaHash } from '@iden3/js-iden3-core';
import { prepareCircuitArrayValues } from '@0xpolygonid/js-sdk';
import { Query } from './types';

export function packValidatorParams(query: Query, allowedIssuers: number[] = []) {
  const abiCoder = new ethers.AbiCoder();
  const {
    schema,
    claimPathKey,
    operator,
    slotIndex,
    value,
    queryHash,
    circuitIds,
    skipClaimRevocationCheck,
    claimPathNotExists
  } = query;

  return abiCoder.encode(
    [
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256[]',
      'uint256',
      'uint256[]',
      'string[]',
      'bool',
      'uint256'
    ],
    [
      schema,
      claimPathKey,
      operator,
      slotIndex,
      value,
      queryHash,
      allowedIssuers,
      circuitIds,
      skipClaimRevocationCheck,
      claimPathNotExists
    ]
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
