// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { PrimitiveTypeUtils } from "@iden3/contracts/lib/PrimitiveTypeUtils.sol";
import { ICircuitValidator } from "@iden3/contracts/interfaces/ICircuitValidator.sol";
import { ZKPVerifier } from "@iden3/contracts/verifiers/ZKPVerifier.sol";
import "./TicketNFT.sol";

error TicketVerifier__SenderNotInProof();
error TicketVerifier__InvalidRequestId();
error TicketVerifier__ProofAlreadySubmitted();

contract TicketVerifier is ZKPVerifier, TicketNFT {
	uint64 public constant PURCHASE_TICKET_REQUEST_ID = 1;

	function _beforeProofSubmit(
		uint64,
		uint256[] memory inputs,
		ICircuitValidator validator
	) internal override {
		address sender = PrimitiveTypeUtils.int256ToAddress(
			inputs[validator.inputIndexOf("challenge")]
		);
		if (msg.sender != sender) {
			revert TicketVerifier__SenderNotInProof();
		}
	}

	function _afterProofSubmit(
		uint64 requestId,
		uint256[] memory,
		ICircuitValidator
	) internal override {
		if (requestId != PURCHASE_TICKET_REQUEST_ID) {
			revert TicketVerifier__InvalidRequestId();
		}
		super._purchaseTicket();
	}
}
