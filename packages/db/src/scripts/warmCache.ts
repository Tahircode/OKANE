import { getBalance } from "../cache/balance";
import { getUserProfile } from "../cache/userProfile";
import { getContacts } from "../cache/contacts";
import { getRedisClient } from "../cache/redisClient";
import db from "../db";

export type P2pTxnType = {
    id: string;
    amount: number;
    status: "Success" | "Failure" | "Processing";
    timestamp: Date;
    fromUserId: string;
    toUserId: string;
    fromUser: { name: string | null; id: string };
    toUser: { name: string | null; id: string };
};
export type OnRampTxnType = {
    id: string;
    amount: number;
    status: "Success" | "Failure" | "Processing";
    provider: string;
    type: "CREDIT" | "DEBIT"; // This comes from the TransactionType enum
    timestamp: Date;
    userId: string;
};
type OnRampHistoryItem = {
  id: string;
  amount: number;
  status: "Success" | "Failure" | "Processing";
  provider: string;
  timestamp: Date;
  type: "CREDIT";
  userId: string;
};

const redis = getRedisClient();
const MAX_HISTORY_TO_WARM = 50;

async function warmCache() {
    const startTime = Date.now();
    try {
        const users = await db.user.findMany({
            select: { id: true }
        });
        if (users.length === 0) return;
        for (const user of users) {
            const userId = user.id;

            await Promise.all([
                getBalance(userId),
                getUserProfile(userId),
                getContacts(userId),
                warmHistory(userId), 
            ]);
        }
        const duration = (Date.now() - startTime) / 1000;

    } catch (e) {
        console.error('Cache warmup error:', e); // Use console.error for errors
    } finally {
        await db.$disconnect();
    }
}

export async function warmHistory(userId: string): Promise<void> {
    const onRampCacheKey = `onRampHistory:${userId}`;
    const p2pCacheKey = `p2pHistory:${userId}`;

    try {
        // 1. Fetch all three types of transactions CONCURRENTLY using Promise.all
        const [onRampTxns, sentP2pTxns, receivedP2pTxns] = await Promise.all([
            db.onRampTransaction.findMany({ where: { userId } }),
            db.p2pTransfer.findMany({
                where: { fromUserId: userId },
                include: {
                    fromUser: { select: { name: true, id: true } },
                    toUser: { select: { name: true, id: true } },
                },
            }),
            db.p2pTransfer.findMany({
                where: { toUserId: userId },
                include: {
                    fromUser: { select: { name: true, id: true } },
                    toUser: { select: { name: true, id: true } },
                },
            }),
        ]);

        // 2. Process OnRamp History
        const onRampHistory: OnRampHistoryItem[] = onRampTxns.map((tx) => ({
            id: tx.id,
            amount: tx.amount,
            status: tx.status,
            provider: tx.provider,
            timestamp: tx.timestamp,
            type: 'CREDIT',
            userId: tx.userId,
        }));

        if (onRampHistory.length > 0) {
            onRampHistory.sort((a, b) => (b.timestamp).getTime() - (a.timestamp).getTime());
            const recentOnRampHistory = onRampHistory.slice(0, MAX_HISTORY_TO_WARM);
            const onRampStrings = recentOnRampHistory.map(tx => JSON.stringify(tx));
            await redis.del(onRampCacheKey);
            await redis.lpush(onRampCacheKey, ...onRampStrings);
            await redis.ltrim(onRampCacheKey, 0, MAX_HISTORY_TO_WARM - 1);
        }

        // 3. Process P2P History
        const p2pHistory = [
            ...sentP2pTxns.map((tx: P2pTxnType) => ({
                id: tx.id,
                amount: -tx.amount, 
                timestamp: tx.timestamp,
                status: tx.status,
                type: 'DEBIT' as const,
                toUser: tx.toUser.name || `User ${tx.toUserId}`,
                toUserId: tx.toUserId,
                fromUser: tx.fromUser.name || `User ${tx.fromUserId}`,
                fromUserId: tx.fromUserId,
            })),
            ...receivedP2pTxns.map((tx: P2pTxnType) => ({
                id: tx.id,
                amount: tx.amount, 
                timestamp: tx.timestamp,
                status: tx.status,
                type: 'CREDIT' as const,
                toUser: tx.toUser.name || `User ${tx.toUserId}`,
                toUserId: tx.toUserId,
                fromUser: tx.fromUser.name || `User ${tx.fromUserId}`,
                fromUserId: tx.fromUserId,
            })),
        ];
        if (p2pHistory.length > 0) {
            p2pHistory.sort((a, b) => (b.timestamp).getTime() - (a.timestamp).getTime());
            const recentP2pHistory = p2pHistory.slice(0, MAX_HISTORY_TO_WARM);
            const p2pStrings = recentP2pHistory.map(tx => JSON.stringify(tx));
            await redis.del(p2pCacheKey);
            await redis.lpush(p2pCacheKey, ...p2pStrings);
            await redis.ltrim(p2pCacheKey, 0, MAX_HISTORY_TO_WARM - 1);
        }

    } catch (error) {
        console.error(`[Worker] Error warming history for user ${userId}:`, error);
    }
}

warmCache();