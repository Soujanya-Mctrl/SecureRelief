// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoucherManager {
    struct Voucher {
        uint256 id;
        uint256 amount;
        string zoneId;
        address beneficiary;
        bool redeemed;
        uint256 expiry;
    }

    mapping(uint256 => Voucher) public vouchers;
    uint256 public nextVoucherId;
    address public treasury; // The source of funds

    event VoucherIssued(uint256 voucherId, address indexed beneficiary, uint256 amount);
    event VoucherRedeemed(uint256 voucherId, address indexed vendor, uint256 amount);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function issueVoucher(address beneficiary, uint256 amount, string memory zoneId) external {
        // In real app, only Oracle or Admin checks this
        uint256 id = nextVoucherId++;
        vouchers[id] = Voucher(id, amount, zoneId, beneficiary, false, block.timestamp + 30 days);
        emit VoucherIssued(id, beneficiary, amount);
    }

    function redeemVoucher(uint256 voucherId) external {
        Voucher storage v = vouchers[voucherId];
        require(!v.redeemed, "Already redeemed");
        require(block.timestamp <= v.expiry, "Expired");
        // In real app, check if msg.sender is an allowed vendor for this zone
        
        v.redeemed = true;
        
        // Call Treasury to transfer funds to vendor (msg.sender)
        // ITreasury(treasury).distribute(v.zoneId, msg.sender, v.amount);
        
        emit VoucherRedeemed(voucherId, msg.sender, v.amount);
    }
}
