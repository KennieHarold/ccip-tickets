export interface Query {
  requestId: number;
  schema: string;
  claimPathKey: string;
  operator: number;
  slotIndex: number;
  value: bigint[];
  queryHash: string;
  circuitIds: string[];
  skipClaimRevocationCheck: boolean;
  claimPathNotExists: number;
}
