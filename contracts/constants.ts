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
    url: 'ipfs://QmTWCK9ytm7uvBFqhQB1C82TTkup1mNUFupZhhw2RG3FkW',
    hash: '203621442218429609519043541580190658077',
    claimPathKeys: {
      age: '10660011478973528120113144268474763699577191512342106881786643070769961423718'
    }
  },
  thid: 'zkp-age-credential-thread-id'
};

export const ContractsConfig: any = {
  ticketVerifier: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_TICKET_VERIFIER_ADDRESS',
      value: process.env.POLYGON_MUMBAI_TICKET_VERIFIER_ADDRESS
    }
  },
  validatorSig: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_SIG_VALIDATOR_ADDRESS',
      value: process.env.POLYGON_MUMBAI_SIG_VALIDATOR_ADDRESS
    }
  },
  sampleERC20Verifier: {
    polygon_mumbai: {
      key: 'POLYGON_MUMBAI_SAMPLE_ERC20_VERIFIER_ADDRESS',
      value: process.env.POLYGON_MUMBAI_SAMPLE_ERC20_VERIFIER_ADDRESS
    }
  }
};

export const HardhatNetworkToProofNetwork: Record<string, string> = {
  polygon_mumbai: 'polygon-mumbai'
};
