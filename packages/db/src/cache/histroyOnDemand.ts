import db from "../db";
import { P2pTxnType, OnRampTxnType } from '../scripts/warmCache';
import { p2pInterface,onRampInterface } from './history';
import { cacheOnRampHistoryInBackground,cacheP2pHistoryInBackground } from './cacheOnDemand';

export async function warmOnRampHistoryOnDemand(userId: string, count: number = 25): Promise<onRampInterface[]> {
  try {
    // 1. Fetch data from database (single query)
    const onRampTxns = await db.onRampTransaction.findMany({
      where: { userId },
      take: count * 2, 
      orderBy: { timestamp: 'desc' },
    });

    // 2. Transform to interface format
    const onRampHistory = onRampTxns.map((tx: OnRampTxnType) => ({
      id: tx.id,
      amount: tx.amount,
      status: tx.status,
      provider: tx.provider,
      timestamp: tx.timestamp,
      type: 'CREDIT' as const,
      userId: tx.userId,
    }));

    // 3. Store in cache (non-blocking, fire-and-forget)
    cacheOnRampHistoryInBackground(userId, onRampHistory);
    
    // 4. Return only the requested count
    return onRampHistory.slice(0, count);
    
  } catch (error) {
    console.error(`Error in warmHistoryOnDemand for user ${userId}:`, error);
    return [];
  }
}

export async function warmP2pHistoryOnDemand(userId: string, count: number = 25): Promise<p2pInterface[]> {
  try {
    
    // 1. Fetch sent and received transactions concurrently
    const [sentTxns, receivedTxns] = await Promise.all([
      db.p2pTransfer.findMany({
        where: { fromUserId: userId },
        take: count,
        orderBy: { timestamp: 'desc' },
        include: {
          fromUser: { select: { name: true, id: true } },
          toUser: { select: { name: true, id: true } },
        },
      }),
      db.p2pTransfer.findMany({
        where: { toUserId: userId },
        take: count,
        orderBy: { timestamp: 'desc' },
        include: {
          fromUser: { select: { name: true, id: true } },
          toUser: { select: { name: true, id: true } },
        },
      }),
    ]);

    // 2. Transform to interface format
    const p2pHistory = [
      ...sentTxns.map((tx: P2pTxnType) => ({
        id: tx.id,
        amount: -tx.amount,
        timestamp: tx.timestamp,
        type: 'DEBIT' as const,
        status: tx.status,
        toUser: tx.toUser.name || `User ${tx.toUserId}`,
        toUserId: tx.toUserId,
        fromUser: tx.fromUser.name || `User ${tx.fromUserId}`,
        fromUserId: tx.fromUserId,
      })),
      ...receivedTxns.map((tx: P2pTxnType) => ({
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

    // 3. Sort by timestamp and limit
    p2pHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const limitedHistory = p2pHistory.slice(0, count);

    // 4. Store in cache (non-blocking)
    cacheP2pHistoryInBackground(userId, limitedHistory);
    
    // 5. Return the data
    return limitedHistory;
    
  } catch (error) {
    console.error(`Error in warmP2pHistoryOnDemand for user ${userId}:`, error);
    return [];
  }
}