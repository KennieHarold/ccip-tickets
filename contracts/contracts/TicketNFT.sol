// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error TicketNFT__DailyLimitReached();
error TicketNFT__InsufficientBalance();

contract TicketNFT is ERC721, Ownable {
	uint256 public constant TICKET_PRICE = 0.001 ether;
	uint32 public constant DAILY_MINT_LIMIT = 5000;

	uint256 private nextTokenId;
	uint256 public dailyMintItervalTime;

	uint32 public dailyMintLimit;
	uint32 public thisDayTotalMint;

	constructor() ERC721("TicketNFT", "TTT") {
		dailyMintItervalTime = block.timestamp;
		thisDayTotalMint = 0;
	}

	modifier priceCompliance() {
		if (TICKET_PRICE > msg.value) {
			revert TicketNFT__InsufficientBalance();
		}
		_;
	}

	modifier withinDailyLimitCompliance() {
		if (block.timestamp > dailyMintItervalTime + 1 days) {
			thisDayTotalMint = 0;
			dailyMintItervalTime = block.timestamp;
		}
		if (thisDayTotalMint > DAILY_MINT_LIMIT) {
			revert TicketNFT__DailyLimitReached();
		}
		_;
	}

	function _purchaseTicket() internal virtual withinDailyLimitCompliance {
		uint256 tokenId = nextTokenId++;
		thisDayTotalMint++;
		_safeMint(msg.sender, tokenId);
	}
}
