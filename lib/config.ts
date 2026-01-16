
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Define Weilchain (Example configuration, reusing Sepolia or custom if we had chainID)
export const weilchain = {
    id: 123456, // Replace with actual Weilchain ID if known, else use a placeholder
    name: 'Weilchain',
    nativeCurrency: { name: 'Weil', symbol: 'WEIL', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.weilchain.com'] }, // Placeholder
    },
} as const;

export const config = createConfig({
    chains: [mainnet, sepolia, hardhat], // Added hardhat for local dev
    connectors: [
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhat.id]: http(),
    },
})
