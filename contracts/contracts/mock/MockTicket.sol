// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../Ticket.sol";

contract MockTicket is Ticket {
    function purchaseTicket() external {
        super._purchaseTicket();
    }
}
