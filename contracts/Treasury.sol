// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Treasury {
    IERC20 public usdc;
    mapping(string => uint256) public disasterZoneAllocations; // zoneId => amount
    address public admin;

    event DonationReceived(address indexed donor, string zoneId, uint256 amount);
    event FundsAllocated(string zoneId, uint256 amount);
    event FundsDistributed(string zoneId, address recipient, uint256 amount);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
        admin = msg.sender;
    }

    // Donor calls this to donate to a specific zone
    function donate(string memory zoneId, uint256 amount) external {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        disasterZoneAllocations[zoneId] += amount;
        emit DonationReceived(msg.sender, zoneId, amount);
    }

    // Admin/Government allocates funds (simulated logic for now)
    function allocateFunds(string memory zoneId, uint256 amount) external {
        require(msg.sender == admin, "Only admin");
        // Logic to move funds or just mark them as allocated for vouchers
        emit FundsAllocated(zoneId, amount);
    }
}
