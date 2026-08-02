// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PraiseBoard - Direct Tipping & Supporter Wall for Ifeoma's City Transit Timetables
 * @notice Allows commuters to send micro-tips directly with zero platform cut or middlemen.
 */
contract PraiseBoard {
    struct Tip {
        address sender;
        string name;
        string message;
        uint256 amount;
        uint256 timestamp;
    }

    address payable public immutable owner;
    Tip[] private tips;
    uint256 public totalTipsCount;
    uint256 public totalAmountRaised;

    event NewTip(
        address indexed sender,
        string name,
        string message,
        uint256 amount,
        uint256 timestamp
    );

    event FundsTransferred(address indexed to, uint256 amount);

    error InvalidTipAmount();
    error TransferFailed();
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _owner) {
        owner = payable(_owner != address(0) ? _owner : msg.sender);
    }

    /**
     * @notice Send a tip with an optional supporter name and message
     * @param _name Display name of the supporter (defaults to Anonymous if empty)
     * @param _message Heartfelt note or message to Ifeoma
     */
    function sendTip(string calldata _name, string calldata _message) external payable {
        if (msg.value == 0) revert InvalidTipAmount();

        string memory displayName = bytes(_name).length > 0 ? _name : "Anonymous Supporter";

        Tip memory newTip = Tip({
            sender: msg.sender,
            name: displayName,
            message: _message,
            amount: msg.value,
            timestamp: block.timestamp
        });

        tips.push(newTip);
        totalTipsCount += 1;
        totalAmountRaised += msg.value;

        // Forward ETH directly to Ifeoma's wallet instantly
        (bool success, ) = owner.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit NewTip(msg.sender, displayName, _message, msg.value, block.timestamp);
        emit FundsTransferred(owner, msg.value);
    }

    /**
     * @notice Fetch all recorded tips on the praise board
     */
    function getAllTips() external view returns (Tip[] memory) {
        return tips;
    }

    /**
     * @notice Get total number of tips received
     */
    function getTipCount() external view returns (uint256) {
        return tips.length;
    }

    /**
     * @notice Fallback to accept direct ETH transfers as anonymous tips
     */
    receive() external payable {
        if (msg.value > 0) {
            tips.push(Tip({
                sender: msg.sender,
                name: "Anonymous Commuter",
                message: "Direct Tip",
                amount: msg.value,
                timestamp: block.timestamp
            }));
            totalTipsCount += 1;
            totalAmountRaised += msg.value;

            (bool success, ) = owner.call{value: msg.value}("");
            if (!success) revert TransferFailed();

            emit NewTip(msg.sender, "Anonymous Commuter", "Direct Tip", msg.value, block.timestamp);
        }
    }
}
