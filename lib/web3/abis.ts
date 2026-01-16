
export const USDC_ABI = [
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            { "name": "recipient", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            { "name": "account", "type": "address" }
        ],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    }
] as const;

export const TREASURY_ABI = [
    {
        "type": "function",
        "name": "donate",
        "inputs": [
            { "name": "zoneId", "type": "string" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "DonationReceived",
        "inputs": [
            { "name": "donor", "type": "address", "indexed": true },
            { "name": "zoneId", "type": "string", "indexed": false },
            { "name": "amount", "type": "uint256", "indexed": false }
        ]
    }
] as const;

export const VOUCHER_MANAGER_ABI = [
    {
        "type": "function",
        "name": "issueVoucher",
        "inputs": [
            { "name": "beneficiary", "type": "address" },
            { "name": "amount", "type": "uint256" },
            { "name": "zoneId", "type": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "redeemVoucher",
        "inputs": [
            { "name": "voucherId", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
] as const;
