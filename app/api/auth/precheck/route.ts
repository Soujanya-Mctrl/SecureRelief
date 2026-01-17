import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { createNonce } from '@/lib/utils/siwe';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await AuthService.findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'User not found. Please register first.' }, { status: 404 });
        }

        const nonce = createNonce();
        await AuthService.updateUserNonce(user.id, nonce);

        return NextResponse.json({
            walletAddress: user.walletAddress,
            nonce,
        });
    } catch (error) {
        console.error('Precheck logic error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
