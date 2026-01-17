import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { verifySiweMessage } from '@/lib/utils/siwe';
import { Status } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, message, signature } = body;

        if (!message || !signature) {
            return NextResponse.json({ error: 'Message and signature are required' }, { status: 400 });
        }

        // 1. Verify SIWE signature first to get the address
        // We need the nonce to verify, but we can't get the user without the address if we don't trust the message yet.
        // Actually, SIWE verify gives us the address.
        // But we need the nonce from the database to ensure replay protection.
        // So we need to find the user FIRST.
        // The message contains the address. We can parse it.

        let user: any; // Type User from prisma

        // Helper to extract address from message without verifying yet (or verify with any nonce just to get address? No, simple regex/parsing)
        const addressMatch = message.match(/0x[a-fA-F0-9]{40}/);
        if (!addressMatch) {
            return NextResponse.json({ error: 'No address found in message' }, { status: 400 });
        }
        const walletAddress = addressMatch[0];

        user = await AuthService.findUserByWallet(walletAddress);

        // Fallback to email if provided and wallet lookup failed (though wallet should be primary for SIWE)
        if (!user && email) {
            user = await AuthService.findUserByEmail(email);
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found. Please register.' }, { status: 404 });
        }

        if (!user.nonce) {
            // If no nonce (maybe it expired or wasn't set), user should request one.
            // But if they are logging in, they should have just requested a nonce.
            return NextResponse.json({ error: 'Nonce not generated for user' }, { status: 400 });
        }

        const verification = await verifySiweMessage(message, signature, user.nonce);

        if (!verification.success) {
            return NextResponse.json({ error: 'Invalid signature', details: verification.error }, { status: 401 });
        }

        if (verification.data?.address.toLowerCase() !== user.walletAddress.toLowerCase()) {
            return NextResponse.json({ error: 'Wallet address mismatch' }, { status: 401 });
        }

        await AuthService.updateUserNonce(user.id, null);

        if (user.status === Status.BLOCKED || user.status === Status.SUSPENDED) {
            return NextResponse.json({ error: 'Account is locked' }, { status: 403 });
        }

        const tokens = AuthService.generateTokens(user);

        return NextResponse.json({
            ...tokens,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
