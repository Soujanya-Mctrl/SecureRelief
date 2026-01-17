import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { createNonce } from '@/lib/utils/siwe';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { walletAddress } = body;

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
        }

        const user = await AuthService.findUserByWallet(walletAddress);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const nonce = createNonce();
        await AuthService.updateUserNonce(user.id, nonce);

        return NextResponse.json({ nonce });
    } catch (error) {
        console.error('Nonce logic error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
