'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/config';
import { AuthProvider } from '@/context/MockAuthContext';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
