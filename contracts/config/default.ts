type ContractAddresses = Record<string, Record<string, string | undefined>>;

export const contractAddresses: ContractAddresses = {
  ticketVerifier: {
    polygon_mumbai: process.env.POLYGON_MUMBAI_TICKET_VERIFIER_ADDRESS
  }
};
