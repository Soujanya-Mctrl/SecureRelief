import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/utils/validators';
import { Role, Status } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.issues }, { status: 400 });
        }

        const { name, email, password, walletAddress, role } = validation.data;

        const existingEmail = await AuthService.findUserByEmail(email);
        if (existingEmail) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        const existingWallet = await AuthService.findUserByWallet(walletAddress);
        if (existingWallet) {
            return NextResponse.json({ error: 'Wallet address already exists' }, { status: 409 });
        }

        const passwordHash = await AuthService.hashPassword(password);

        let status: Status = Status.PENDING;
        if (role === Role.DONOR) status = Status.ACTIVE;
        if (role === Role.ADMIN) status = Status.BLOCKED;

        await AuthService.createUser({
            name,
            email,
            passwordHash,
            walletAddress,
            role: role as Role,
            status,
        });

        return NextResponse.json({ message: 'Registration successful. Please login.' }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
