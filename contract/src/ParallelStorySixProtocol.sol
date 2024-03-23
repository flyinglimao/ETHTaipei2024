// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC1155Symbol} from "./interfaces/IERC1155Symbol.sol";
import {IAIOracle} from "./interfaces/IAIOracle.sol";
import {IMintClubBondV2} from "./interfaces/IMintClubBondV2.sol";
import {IDysonPair} from "./interfaces/IDysonPair.sol";
import {AIOracleCallbackReceiver} from "./lib/AIOracleCallbackReceiver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ParallelStorySixProtocol is
    AIOracleCallbackReceiver,
    Ownable,
    ERC1155Holder
{
    enum Phase {
        Iso,
        Propose,
        Vote,
        Execute,
        Finish
    }

    IERC20 public immutable usdc;
    IERC20 public immutable weth;
    IDysonPair public immutable usdcEthPair;
    IMintClubBondV2 public immutable mintClubBond;
    mapping(IERC1155Symbol => bool) public isStoryToken;
    IERC1155Symbol[] public storyIdToToken; // storyIdToToken[storyId] = token
    string[][] public storyIdToParagraphs; // storyIdToParagraphs[storyId][paragraphId] = paragraph
    string[][][] public storyIdToParagraphProposes; // storyIdToParagraphProposes[storyId][paragraphId][proposeId] = paragraphPropose
    mapping(uint256 => uint256) public requestIdToStoryId; // requestIdToStoryId[requestId] = storyId
    mapping(address => bool)[][] public userVoted; // userToPropose[storyId][paragraphId][userId] = proposeId
    address[][][][] public proposeToAddress; // proposeToAddress[storyId][paragraphId][proposeId] = userAddress
    Phase[] public storyIdToPhase; // 0: iso, 1: propose, 2: vote, 3: Execute, 4: finish
    uint256[] public storyIdToPhaseLength;
    uint256[] public storyIdToEndTime; // storyIdToEndTime[storyId] = endTime
    uint256[] public isoAmount;
    mapping(uint256 => uint256) public storyIdToDysonNote;

    constructor(
        IAIOracle _aiOracle,
        IMintClubBondV2 _mintClubBond,
        IDysonPair _usdcEthPair
    ) AIOracleCallbackReceiver(_aiOracle) Ownable(msg.sender) {
        mintClubBond = _mintClubBond;
        usdcEthPair = _usdcEthPair;
        weth = IERC20(usdcEthPair.token0());
        usdc = IERC20(usdcEthPair.token1());
    }

    function rescueERC20(
        IERC20 tokenAddress,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(tokenAddress != usdc, "usdc");
        require(tokenAddress != weth, "weth");
        tokenAddress.transfer(to, amount);
    }

    function rescueERC1155(
        address tokenAddress,
        address to,
        uint256 id,
        uint256 amount
    ) external onlyOwner {
        require(!isStoryToken[IERC1155Symbol(tokenAddress)], "storytoken");
        IERC1155Symbol(tokenAddress).safeTransferFrom(
            address(this),
            to,
            id,
            amount,
            ""
        );
    }

    function aiOracleCallback(
        uint256 requestId,
        bytes calldata output,
        bytes calldata
    ) external override onlyAIOracleCallback {
        uint256 storyId = requestIdToStoryId[requestId];
        // for demo, we assume it won't be updated
        require(storyId != type(uint256).max, "finalized");
        require(storyIdToPhase[storyId] == Phase.Execute, "not execute phase");
        storyIdToParagraphs[storyId].push(string(output));
        requestIdToStoryId[requestId] = type(uint256).max;

        _toProposePhase(storyId);
    }

    function startIso(
        IERC1155Symbol token,
        uint256 amount,
        uint256 duration
    ) external returns (uint256 storyId) {
        token.safeTransferFrom(msg.sender, address(this), 0, amount, "");
        token.setApprovalForAll(address(mintClubBond), true);
        isStoryToken[token] = true;
        storyId = storyIdToToken.length;
        storyIdToToken.push(token);
        storyIdToParagraphs.push();
        storyIdToParagraphProposes.push();
        userVoted.push();
        proposeToAddress.push();
        storyIdToPhase.push(Phase.Iso);
        storyIdToEndTime.push();
        storyIdToEndTime[storyId] = block.timestamp + duration;
        isoAmount.push(amount);
        return storyId;
    }

    // lock usdc value into dyson
    // who can do this?
    function finishIso(uint256 storyId, uint256 duration) external {
        require(storyIdToPhase[storyId] == Phase.Iso, "not iso phase");
        require(storyIdToEndTime[storyId] < block.timestamp, "not finished");
        uint256 val = mintClubBond.burn(
            address(storyIdToToken[storyId]),
            isoAmount[storyId],
            0, // TODO: safe amount
            msg.sender
        );
        usdc.approve(address(usdcEthPair), val);
        storyIdToDysonNote[storyId] = usdcEthPair.deposit1(
            address(this),
            val,
            0,
            1 days
        );
        storyIdToPhaseLength[storyId] = duration;

        _toProposePhase(storyId);
    }

    function reinvest(uint256 storyId) external {
        require(storyIdToPhase[storyId] != Phase.Finish, "finished");

        // it will revert if still staked
        (uint256 amount0, uint256 amount1) = usdcEthPair.withdraw(
            storyIdToDysonNote[storyId],
            address(this)
        );

        if (amount0 != 0) {
            weth.approve(address(mintClubBond), amount0);
            storyIdToDysonNote[storyId] = usdcEthPair.deposit0(
                address(this),
                amount0,
                0,
                1 days
            );
        }

        if (amount1 != 0) {
            usdc.approve(address(mintClubBond), amount1);
            storyIdToDysonNote[storyId] = usdcEthPair.deposit1(
                address(this),
                amount1,
                0,
                1 days
            );
        }
    }

    function propose(uint256 storyId, string memory paragraph) external {
        require(storyIdToPhase[storyId] == Phase.Propose, "not propose phase");
        uint256 paragraphId = storyIdToParagraphs[storyId].length;
        storyIdToParagraphProposes[storyId][paragraphId].push(paragraph);
        userVoted[storyId].push();
        proposeToAddress[storyId].push();
    }

    function endPropose(uint256 storyId) external {
        require(storyIdToPhase[storyId] == Phase.Propose, "not propose phase");
        require(storyIdToEndTime[storyId] < block.timestamp, "not finished");

        storyIdToPhase[storyId] = Phase.Vote;
        storyIdToEndTime[storyId] =
            block.timestamp +
            storyIdToPhaseLength[storyId];
    }

    function vote(uint256 storyId, uint256 proposeId) external {
        require(storyIdToPhase[storyId] == Phase.Vote, "not vote phase");
        require(storyIdToEndTime[storyId] < block.timestamp, "not finished");

        uint256 paragraphId = storyIdToParagraphs[storyId].length;
        require(!userVoted[storyId][paragraphId][msg.sender], "voted");

        userVoted[storyId][paragraphId][msg.sender] = true;
        proposeToAddress[storyId][paragraphId][proposeId].push(msg.sender);
    }

    function endVote(uint256 storyId) external {
        require(storyIdToPhase[storyId] == Phase.Vote, "not vote phase");
        require(storyIdToEndTime[storyId] < block.timestamp, "not finished");

        uint256 paragraphId = storyIdToParagraphs[storyId].length;

        uint256 selectedParagraphId = 0;
        uint256 maxVotes = 0;
        IERC1155Symbol token = storyIdToToken[storyId];
        for (
            uint256 i = storyIdToParagraphProposes[storyId][paragraphId].length;
            i > 0;
            --i
        ) {
            uint256 votes = 0;
            address[] memory voters = proposeToAddress[storyId][paragraphId][i];
            for (uint256 j = 0; j < voters.length; j++) {
                votes += token.balanceOf(voters[j], 0);
            }
            if (votes > maxVotes) {
                selectedParagraphId = i;
                maxVotes = votes;
            }
        }

        storyIdToPhase[storyId] = Phase.Execute;
        string memory selectedParagraph = storyIdToParagraphProposes[storyId][
            paragraphId
        ][selectedParagraphId];
        uint256 requestId = aiOracle.requestCallback(
            11,
            bytes(selectedParagraph),
            address(this),
            0, // TODO
            abi.encode(storyId)
        );
        requestIdToStoryId[requestId] = storyId;
    }

    // if no new propose, finish the story
    function finishStory(uint256 storyId) external {
        require(storyIdToPhase[storyId] == Phase.Propose, "not propose phase");
        require(
            storyIdToParagraphProposes[storyId][
                storyIdToParagraphs[storyId].length
            ].length == 0,
            "new propose"
        );
        require(storyIdToEndTime[storyId] < block.timestamp, "not finished");
        storyIdToPhase[storyId] = Phase.Finish;
    }

    function releaseIso(uint256 storyId) external {
        require(storyIdToPhase[storyId] == Phase.Finish, "not execute phase");

        (uint256 amount0, uint256 val) = usdcEthPair.withdraw(
            storyIdToDysonNote[storyId],
            address(this)
        );

        if (amount0 != 0) {
            weth.approve(address(usdcEthPair), amount0);
            val += usdcEthPair.swap0in(address(this), amount0, 0);
        }

        usdc.approve(address(mintClubBond), val);
        mintClubBond.mint(
            address(storyIdToToken[storyId]),
            val,
            0, // TODO: safe amount
            msg.sender
        );
        IERC1155Symbol token = storyIdToToken[storyId];
        token.safeTransferFrom(
            address(this),
            address(token),
            0,
            token.balanceOf(address(this), 0),
            ""
        );
    }

    function storySymbol(
        uint256 storyId
    ) external view returns (string memory) {
        return storyIdToToken[storyId].symbol();
    }

    function story(
        uint256 storyId
    ) external view returns (string memory result) {
        string[] memory paragraphs = storyIdToParagraphs[storyId];
        for (uint256 i = 0; i < paragraphs.length; i++) {
            result = string(abi.encodePacked(result, paragraphs[i], "\n\n"));
        }
    }

    function totalStory() external view returns (uint256) {
        return storyIdToToken.length;
    }

    function currentProposes(
        uint256 storyId
    ) external view returns (uint256, string[] memory) {
        require(storyIdToPhase[storyId] == Phase.Propose, "not propose phase");

        uint256 paragraphId = _currentParagraphSlot(storyId);
        return (paragraphId, storyIdToParagraphProposes[storyId][paragraphId]);
    }

    // return the deciding paragraph slot id
    function _currentParagraphSlot(
        uint256 storyId
    ) internal view returns (uint256) {
        return storyIdToParagraphs[storyId].length;
    }

    function _createNewParagraphSlot(uint256 storyId) internal {
        storyIdToParagraphs[storyId].push();
        storyIdToParagraphProposes[storyId].push();
        userVoted[storyId].push();
        proposeToAddress[storyId].push();
    }

    function _toProposePhase(uint256 storyId) internal {
        storyIdToPhase[storyId] = Phase.Propose;
        storyIdToEndTime[storyId] =
            block.timestamp +
            storyIdToPhaseLength[storyId];
        _createNewParagraphSlot(storyId);
    }
}
