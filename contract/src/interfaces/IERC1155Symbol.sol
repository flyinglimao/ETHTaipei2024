// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IERC1155Symbol is IERC1155 {
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
}
