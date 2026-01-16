'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/MockAuthContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ShieldCheck, Bell, User, LogOut, ChevronDown, Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { injected } from 'wagmi/connectors';

export function Navbar() {
    const { role, setRole, isAuthenticated, logout: authLogout } = useAuth();
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogin = () => {
        connect({ connector: injected() });
    };

    const handleDisconnect = () => {
        disconnect();
        authLogout();
    };

    const navLinks = [
        { name: 'How it Works', href: '/#how-it-works' },
        { name: 'Active Reliefs', href: '/#campaigns' },
        { name: 'Impact', href: '/impact/hurricane-delta' }, // Mock link
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Relief Fund</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">

                    {/* Wallet Status */}
                    {isConnected ? (
                        <div className="flex items-center gap-2 rounded-full border px-3 py-1 bg-muted/50">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span className="text-xs font-mono font-medium text-muted-foreground">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                        </div>
                    ) : (
                        <Button size="sm" variant="outline" onClick={handleLogin} className="gap-2">
                            <Wallet className="h-4 w-4" />
                            Connect Wallet
                        </Button>
                    )}

                    {/* Role Badge (Only if connected) */}
                    {isConnected && (
                        <Badge variant="secondary" className="capitalize">
                            {role}
                        </Badge>
                    )}

                    {/* Notifications */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                        </Button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-80 rounded-xl border bg-card p-4 shadow-lg ring-1 ring-black/5"
                                >
                                    <h4 className="mb-2 text-sm font-semibold">Notifications</h4>
                                    <div className="space-y-2">
                                        <div className="flex gap-3 rounded-lg bg-muted/50 p-2 text-sm">
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                                            <div>
                                                <p className="font-medium">Hurricane Delta Relief</p>
                                                <p className="text-xs text-muted-foreground">Your donation of 50 USDC was allocated to Medical Aid.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 rounded-lg p-2 text-sm hover:bg-muted/50">
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-muted-foreground shrink-0" />
                                            <div>
                                                <p className="font-medium">New Campaign Alert</p>
                                                <p className="text-xs text-muted-foreground">Wildfire Recovery Fund is now live.</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Panel */}
                    {isConnected ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserOpen(!isUserOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>

                            <AnimatePresence>
                                {isUserOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 rounded-xl border bg-card p-2 shadow-lg ring-1 ring-black/5"
                                    >
                                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                            User Panel
                                        </div>
                                        <div className="h-px bg-border my-1" />
                                        <Link href={`/dashboard/${role}`} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                                            <User className="h-4 w-4" />
                                            My Dashboard
                                        </Link>

                                        {/* Role Switcher for Dev (integrated here too for ease, or keep separate dev tool) */}
                                        <div className="px-2 py-1.5 text-xs text-muted-foreground mt-2">Switch Role (Dev)</div>
                                        {['donor', 'admin', 'beneficiary', 'vendor', 'oracle', 'government'].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => { setRole(r as UserRole); setIsUserOpen(false); }}
                                                className={cn(
                                                    "w-full text-left px-2 py-1 text-xs rounded hover:bg-muted capitalize",
                                                    role === r && "bg-primary/10 text-primary font-medium"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}

                                        <div className="h-px bg-border my-1" />
                                        <button
                                            onClick={handleDisconnect}
                                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Disconnect
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        // If not connected, maybe just an empty avatar placeholder or nothing
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b bg-background"
                    >
                        <div className="p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-sm font-medium hover:text-primary"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t">
                                {isConnected ? <Button onClick={handleDisconnect} variant="destructive" className="w-full">Disconnect</Button> : <Button onClick={handleLogin} className="w-full">Connect Wallet</Button>}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
