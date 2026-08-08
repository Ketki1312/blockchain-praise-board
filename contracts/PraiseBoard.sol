// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PraiseBoard - Direct Web3 Tipping & Supporter Wall for Ifeoma's City Transit Timetables
 * @notice Allows commuters to send micro-tips with notes, recorded on-chain via event logs.
 */
contract PraiseBoard {
    struct Tip {
        address sender;
        string name;
        string note;
        uint256 amount;
        uint256 timestamp;
    }

    address payable public immutable owner;
    Tip[] private tips;
    uint256 public totalTipsCount;
    uint256 public totalAmountRaised;

    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // Event declared with note parameter (non-indexed string) and msg.sender & msg.value
    event NewTip(
        address indexed sender,
        string name,
        string note,
        uint256 amount,
        uint256 timestamp
    );

    event FundsTransferred(address indexed to, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    error InvalidTipAmount();
    error NoteTooLong();
    error NameTooLong();
    error TransferFailed();
    error OnlyOwner();
    error NoBalanceToWithdraw();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address _owner) {
        owner = payable(_owner != address(0) ? _owner : msg.sender);
        _status = _NOT_ENTERED;
    }

    /**
     * @notice Send a tip with a supporter name and note
     * @param _name Display name of the supporter (defaults to Anonymous Supporter if empty)
     * @param _note Short note or message to Ifeoma (max 280 characters)
     */
    function sendTip(string calldata _name, string calldata _note) external payable nonReentrant {
        if (msg.value == 0) revert InvalidTipAmount();
        if (bytes(_note).length > 280) revert NoteTooLong();
        if (bytes(_name).length > 100) revert NameTooLong();

        string memory displayName = bytes(_name).length > 0 ? _name : "Anonymous Supporter";

        // CHECKS-EFFECTS: Update contract state BEFORE external transfers
        Tip memory newTip = Tip({
            sender: msg.sender,
            name: displayName,
            note: _note,
            amount: msg.value,
            timestamp: block.timestamp
        });

        tips.push(newTip);
        totalTipsCount += 1;
        totalAmountRaised += msg.value;

        // EMIT EVENT: Event carries msg.sender, displayName, _note, msg.value, block.timestamp
        emit NewTip(msg.sender, displayName, _note, msg.value, block.timestamp);

        // INTERACTIONS: Transfer value to beneficiary
        (bool success, ) = owner.call{value: msg.value}("");
        if (!success) revert TransferFailed();
        emit FundsTransferred(owner, msg.value);
    }

    /**
     * @notice Allows only the owner to withdraw any accumulated contract balance
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalanceToWithdraw();

        (bool success, ) = owner.call{value: balance}("");
        if (!success) revert TransferFailed();

        emit FundsWithdrawn(owner, balance);
    }

    /**
     * @notice Fetch all recorded tips stored in contract state
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
                note: "Direct Tip",
                amount: msg.value,
                timestamp: block.timestamp
            }));
            totalTipsCount += 1;
            totalAmountRaised += msg.value;

            emit NewTip(msg.sender, "Anonymous Commuter", "Direct Tip", msg.value, block.timestamp);
        }
    }
}
