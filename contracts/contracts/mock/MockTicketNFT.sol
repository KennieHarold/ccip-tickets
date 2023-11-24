// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../TicketNFT.sol";

contract MockTicketNFT is TicketNFT {
	function purchaseTicket() external {
		super._purchaseTicket();
	}
}
