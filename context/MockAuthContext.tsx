'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { getRoleByAddress } from '@/lib/auth/roleConfig';

export type UserRole =
    | 'guest'
    | 'donor'
    | 'admin'
    | 'beneficiary'
    | 'vendor'
    | 'oracle'
    | 'government';

interface AuthContextType {
    role: UserRole;
    setRole: (role: UserRole) => void; // Keeping setRole for Dev Mode overrides
    isAuthenticated: boolean;
    walletAddress?: string;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected, status } = useAccount();
    const { disconnect } = useDisconnect();

    const [role, setRole] = useState<UserRole>('guest');
    const [isDevOverride, setIsDevOverride] = useState(false);

    // Auto-detect role when wallet changes, unless dev override is active
    useEffect(() => {
        if (!isDevOverride) {
            if (isConnected && address) {
                const detectedRole = getRoleByAddress(address);
                console.log(`[Auth] Wallet connected: ${address}. Detected Role: ${detectedRole}`);
                setRole(detectedRole);
            } else {
                setRole('guest');
            }
        }
    }, [address, isConnected, isDevOverride]);

    const handleSetRole = (newRole: UserRole) => {
        // If manually setting role (Dev Mode), enable override
        setIsDevOverride(true);
        setRole(newRole);
    };

    const logout = () => {
        disconnect();
        setRole('guest');
        setIsDevOverride(false);
    };

    return (
        <AuthContext.Provider value={{
            role,
            setRole: handleSetRole,
            isAuthenticated: role !== 'guest',
            walletAddress: address,
            logout,
            isLoading: status === 'reconnecting' || status === 'connecting'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
