// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IMintClubBondV2 {
    function mint(
        address token,
        uint256 tokensToMint,
        uint256 maxReserveAmount,
        address receiver
    ) external returns (uint256);

    function burn(
        address token,
        uint256 tokensToBurn,
        uint256 minRefund,
        address receiver
    ) external returns (uint256);
}
