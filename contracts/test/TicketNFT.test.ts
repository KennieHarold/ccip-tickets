import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { MockTicketNFT } from '../typechain-types';

describe('TicketNFT Test Suite', async function () {
  let [owner, user1, verifier]: SignerWithAddress[] = [];
  let TicketNFT: MockTicketNFT;

  before(async function () {
    [owner, user1, verifier] = await ethers.getSigners();
  });

  describe('#Deployment', async function () {
    it('should deploy contract', async function () {
      const Contract = await ethers.getContractFactory('MockTicketNFT');
      TicketNFT = await Contract.deploy();
      TicketNFT.waitForDeployment();
    });

    it('should return correct data', async function () {
      expect(await TicketNFT.TICKET_PRICE()).equals(ethers.parseEther('0.001'));
      expect(await TicketNFT.DAILY_PURCHASE_LIMIT()).equals(5000);
      expect(await TicketNFT.thisDayTotalMint()).equals(0);
    });
  });

  describe('#Mint', async function () {
    it('should mint ticket with right constraints', async function () {
      await TicketNFT.connect(user1).purchaseTicket();
      expect(await TicketNFT.ownerOf(0)).equal(await user1.getAddress());
      expect(await TicketNFT.thisDayTotalMint()).equal(1);
    });
  });
});
