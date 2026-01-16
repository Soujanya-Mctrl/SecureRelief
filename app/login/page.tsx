'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAuth, UserRole } from '@/context/MockAuthContext';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Users, Store, Glasses, Landmark, ArrowRight, Wallet, AlertTriangle, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const roles = [
    { id: 'donor', label: 'Donor', icon: User, desc: 'Global impact, verified.' },
    { id: 'beneficiary', label: 'Beneficiary', icon: Users, desc: 'Instant, secure aid.' },
    { id: 'vendor', label: 'Vendor', icon: Store, desc: 'Scan & redeem vouchers.' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'System oversight.' },
    { id: 'oracle', label: 'Oracle', icon: Glasses, desc: 'Verify claims.' },
    { id: 'government', label: 'Government', icon: Landmark, desc: 'Compliance & audit.' },
];

export default function LoginPage() {
    const { isConnected } = useAccount();
    const { connect } = useConnect();
    const { setRole, isAuthenticated, role } = useAuth();
    const router = useRouter();
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        if (isAuthenticated && role && role !== 'guest') {
            router.push(`/dashboard/${role}`);
        }
    }, [isAuthenticated, role, router]);

    const handleLogin = (roleId: string) => {
        setRole(roleId as UserRole);
        // If not connected, we still set role for dev testing, but normally we'd want wallet first.
        // For dev mode, we allow bypass.
        if (!isConnected) {
            connect({ connector: injected() });
        } else {
            router.push(`/dashboard/${roleId}`);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual & Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A0F1C] text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-transparent" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">SecureRelief</span>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
                            Aid that moves at the speed of urgency.
                        </h1>
                        <p className="text-xl text-gray-300 font-light">
                            Direct, transparent, and instant relief distribution powered by Weilchain.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-gray-400">
                    <span>Trusted by NGOs</span>
                    <span>•</span>
                    <span>Audit Ready</span>
                    <span>•</span>
                    <span>Global Reach</span>
                </div>
            </div>

            {/* Right Side - Interaction */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
                        <p className="mt-2 text-muted-foreground">Active Portal Access</p>
                    </div>

                    {/* Primary Web3 Login */}
                    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-primary" />
                            Connect Wallet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Connect your wallet to automatically access your authorized dashboard (Beneficiary, Vendor, Donor, etc.).
                        </p>
                        <Button
                            className="w-full h-12 text-base"
                            onClick={() => connect({ connector: injected() })}
                            disabled={isConnected}
                        >
                            <Wallet className="mr-2 h-5 w-5" />
                            {isConnected ? 'Wallet Connected' : 'Connect MetaMask / Web3'}
                        </Button>
                    </div>

                    {/* Dev Mode Toggle */}
                    <div className="pt-8 border-t">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Developer Tools</p>
                            <Button variant="ghost" size="sm" onClick={() => setIsDevMode(!isDevMode)} className="h-6 text-xs gap-1">
                                <Code className="h-3 w-3" /> {isDevMode ? 'Hide Overrides' : 'Simulate Roles'}
                            </Button>
                        </div>

                        <AnimatePresence>
                            {isDevMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg mb-4">
                                        <div className="flex gap-2 items-start">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                            <div className="text-xs text-yellow-800">
                                                <strong>Simulation Mode:</strong> Select a role below to forcibly override the auth state without changing wallets.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {roles.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleLogin(r.id)}
                                                className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted rounded-lg text-left transition-colors border border-transparent hover:border-gray-200"
                                            >
                                                <div className="p-2 bg-background rounded-md shadow-sm">
                                                    <r.icon className="h-4 w-4 text-foreground" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{r.label}</div>
                                                    <div className="text-[10px] text-muted-foreground">{r.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
