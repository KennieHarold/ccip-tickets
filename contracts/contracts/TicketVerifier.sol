// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { PrimitiveTypeUtils } from "@iden3/contracts/lib/PrimitiveTypeUtils.sol";
import { ICircuitValidator } from "@iden3/contracts/interfaces/ICircuitValidator.sol";
import { ZKPVerifier } from "@iden3/contracts/verifiers/ZKPVerifier.sol";

contract TicketVerifier is ZKPVerifier {
	function _beforeProofSubmit(
		uint64,
		uint256[] memory inputs,
		ICircuitValidator validator
	) internal view override {}

	function _afterProofSubmit(
		uint64 requestId,
		uint256[] memory inputs,
		ICircuitValidator validator
	) internal override {}
}
