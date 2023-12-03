// cSpell:disable

export const Operators = {
  NOOP: 0, // No operation, skip query verification in circuit
  EQ: 1, // equal
  LT: 2, // less than
  GT: 3, // greater than
  IN: 4, // in
  NIN: 5, // not in
  NE: 6 // not equal
};

export const ProofConfig = {
  name: 'tourist ticket',
  metadataTypeURL: 'https://iden3-communication.io/proofs/1.0/contract-invoke-request',
  metadataType: 'application/iden3comm-plain-json',
  methodId: 'b68967e2',
  schema: {
    type: 'KYCTouristCredential',
    url: 'ipfs://QmU9Re2P93tV4KYT8Si2aCBQYG4zGsw6wBbZki3Yoh68rh',
    hash: '130903017388616086343241723006487066025',
    claimPathKeys: {
      age: '13769861309497563805705163485132244960157997917302847060583313483605752727827'
    }
  },
  thid: '7f38a193-0918-4a48-9fac-36adfdb8b542',
  circuitId: 'credentialAtomicQuerySigV2OnChain'
};

export const ContractsConfig: any = {
  verifier: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_VERIFIER_ADDRESS',
      value: process.env.POLYGON_MUMBAI_VERIFIER_ADDRESS
    }
  },
  validator: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_VALIDATOR_ADDRESS',
      value: process.env.POLYGON_MUMBAI_VALIDATOR_ADDRESS
    }
  },
  state: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_STATE_ADDRESS',
      value: process.env.POLYGON_MUMBAI_STATE_ADDRESS
    }
  }
};

export const HardhatNetworkToProofNetwork: Record<string, string> = {
  polygon_mumbai: 'polygon-mumbai'
};
