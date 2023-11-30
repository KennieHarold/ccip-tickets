// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { PrimitiveTypeUtils } from "@iden3/contracts/lib/PrimitiveTypeUtils.sol";
import { ICircuitValidator } from "@iden3/contracts/interfaces/ICircuitValidator.sol";
import { ZKPVerifier } from "@iden3/contracts/verifiers/ZKPVerifier.sol";

contract ERC20Verifier is ERC20, ZKPVerifier {
    uint64 public constant TRANSFER_REQUEST_ID = 1;
    uint256 public TOKEN_AMOUNT_FOR_AIRDROP_PER_ID = 5 * 10 ** uint(decimals());

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    function _beforeProofSubmit(
        uint64,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        address addr = PrimitiveTypeUtils.int256ToAddress(
            inputs[validator.inputIndexOf("challenge")]
        );
        require(_msgSender() == addr, "address in proof is not a sender address");
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );
        uint256 id = inputs[1];
        if (idToAddress[id] == address(0) && addressToId[_msgSender()] == 0) {
            super._mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }

    function _beforeTokenTransfer(address, address to, uint256) internal view override {
        require(
            proofs[to][TRANSFER_REQUEST_ID] == true,
            "only identities who provided proof are allowed to receive tokens"
        );
    }
}
