'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

export type UserRole =
    | 'guest'
    | 'donor'
    | 'admin'
    | 'beneficiary'
    | 'vendor'
    | 'oracle'
    | 'government';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    walletAddress: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    isAuthenticated: boolean;
    walletAddress?: string;
    login: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    setRole: (role: UserRole) => void; // Kept for compatibility, acts as local override
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>('guest');
    const [isLoading, setIsLoading] = useState(true);

    // Check session on mount
    useEffect(() => {
        const checkAuth = async () => {
            // We need to store the token somewhere. 
            // Ideally we used cookies, so the browser handles it.
            // But my login route returns token in body.
            // If I didn't set cookie, I need to store it in localStorage.
            // But for now, let's assume we implement checkAuth later or rely on token in localStorage.

            // Wait, if I want to persist login, I should have used cookies.
            // But my implementation returned token in JSON.
            // So I'll store in localStorage.
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                        setRole(userData.role.toLowerCase() as UserRole);
                    } else {
                        // Token invalid
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async () => {
        if (!address || !isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);
            // 1. Get Nonce
            const nonceRes = await fetch('/api/auth/nonce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: address })
            });

            if (!nonceRes.ok) {
                const error = await nonceRes.json();
                throw new Error(error.error || 'Failed to get nonce');
            }

            const { nonce } = await nonceRes.json();

            // 2. Sign Message
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId: 1, // Mainnet (or whatever chainId you use)
                nonce: nonce,
            });
            const messageText = message.prepareMessage();
            const signature = await signMessageAsync({ message: messageText });

            // 3. Login
            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    signature
                })
            });

            if (!loginRes.ok) {
                const error = await loginRes.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await loginRes.json();

            // Store tokens
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            setUser(data.user);
            setRole(data.user.role.toLowerCase() as UserRole);

        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed: ' + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setRole('guest');
        disconnect();
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            setRole, // For now, just updates local state
            isAuthenticated: !!user,
            walletAddress: address,
            login,
            logout,
            isLoading
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
