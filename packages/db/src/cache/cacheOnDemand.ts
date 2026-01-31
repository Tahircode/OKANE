import { getRedisClient } from "./redisClient";
const redis = getRedisClient();
import { onRampInterface } from "./history";
import { p2pInterface } from "./history";
export async function cacheOnRampHistoryInBackground(userId: string, history: onRampInterface[]): Promise<void> {
  try {
    setTimeout(async () => {
      const cachedKey = `onRampHistory:${userId}`;
      if (history.length > 0) {
        const historyStrings = history.map(tx => JSON.stringify(tx));
        
        // Use pipeline for atomic operations
        const pipeline = redis.pipeline();
        pipeline.del(cachedKey);
        pipeline.lpush(cachedKey, ...historyStrings);
        pipeline.ltrim(cachedKey, 0, 49); // Keep last 50 items
        pipeline.expire(cachedKey, 3600); // 1 hour expiry
        
        await pipeline.exec();
      }
    }, 0); 
  } catch (error) {
    console.error('Background cache error for on-ramp:', error);
  }
}

export async function cacheP2pHistoryInBackground(userId: string, history: p2pInterface[]): Promise<void> {
  try {
    setTimeout(async () => {
      const cachedKey = `p2pHistory:${userId}`;
      if (history.length > 0) {
        const historyStrings = history.map(tx => JSON.stringify(tx));
        
        const pipeline = redis.pipeline();
        pipeline.del(cachedKey);
        pipeline.lpush(cachedKey, ...historyStrings);
        pipeline.ltrim(cachedKey, 0, 49);
        pipeline.expire(cachedKey, 3600);
        
        await pipeline.exec();
      }
    }, 0);
  } catch (error) {
    console.error('Background cache error for P2P:', error);
  }
}