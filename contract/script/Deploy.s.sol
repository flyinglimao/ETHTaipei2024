// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ParallelStorySixProtocol} from "../src/ParallelStorySixProtocol.sol";
import {IAIOracle} from "../src/interfaces/IAIOracle.sol";
import {IMintClubBondV2} from "../src/interfaces/IMintClubBondV2.sol";
import {IDysonPair} from "../src/interfaces/IDysonPair.sol";

contract DeployProtocolScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();
        ParallelStorySixProtocol protocol = new ParallelStorySixProtocol(
            IAIOracle(0x0A0f4321214BB6C7811dD8a71cF587bdaF03f0A0),
            IMintClubBondV2(0x8dce343A86Aa950d539eeE0e166AFfd0Ef515C0c),
            IDysonPair(0xa28d7Dd51144426557afF3Db67d285d76c127d20)
        );

        console.log("Protocol deployed at address: ", address(protocol));
    }
}
