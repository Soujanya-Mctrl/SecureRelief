import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    role: string;
    walletAddress: string;
}

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
