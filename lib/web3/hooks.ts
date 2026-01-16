
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USDC_ABI, TREASURY_ABI, VOUCHER_MANAGER_ABI } from './abis';
import { parseUnits } from 'viem';

// Addresses - MOCK ADDRESSES (Replace with deployed addresses in real env)
export const USDC_ADDRESS = "0x0000000000000000000000000000000000000001";
export const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000002";
export const VOUCHER_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000003";

export function useUSDCBalance(address: string | undefined) {
    return useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });
}

export function useDonate() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const donate = (zoneId: string, amount: string) => {
        // First approve (Skipping generic approval flow for brevity in this hook, but in real app need approve first)
        // Assume approved or handle approval separately
        writeContract({
            address: TREASURY_ADDRESS,
            abi: TREASURY_ABI,
            functionName: 'donate',
            args: [zoneId, parseUnits(amount, 6)], // USDC 6 decimals
        });
    };

    return { donate, isPending, isConfirming, isConfirmed, error, hash };
}

export function useIssueVoucher() {
    const { writeContract, data: hash, isPending } = useWriteContract();

    // For Oracle/Admin use
    const issue = (beneficiary: string, amount: string, zoneId: string) => {
        writeContract({
            address: VOUCHER_MANAGER_ADDRESS,
            abi: VOUCHER_MANAGER_ABI,
            functionName: 'issueVoucher',
            args: [beneficiary as `0x${string}`, parseUnits(amount, 6), zoneId],
        });
    };

    return { issue, isPending, hash };
}

export function useRedeemVoucher() {
    const { writeContract, data: hash, isPending } = useWriteContract();

    // For Vendor use
    const redeem = (voucherId: number) => {
        writeContract({
            address: VOUCHER_MANAGER_ADDRESS,
            abi: VOUCHER_MANAGER_ABI,
            functionName: 'redeemVoucher',
            args: [BigInt(voucherId)],
        });
    };

    return { redeem, isPending, hash };
}
