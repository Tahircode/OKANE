import { getRedisClient } from "./redisClient";
import { warmOnRampHistoryOnDemand, warmP2pHistoryOnDemand } from "./histroyOnDemand";
const redis = getRedisClient();
const MAX_HISTORY = 77;
export interface p2pInterface  {
  id: string;
  amount: number;
  timestamp: Date;
  type: 'CREDIT' | 'DEBIT',
  status: "Success" | "Failure" | "Processing",
  toUser  : string,
  toUserId : string,
  fromUser: string,
  fromUserId : string,
};
export interface onRampInterface {
  id: string,
  amount : number,
  status: "Success" | "Failure" | "Processing",
  provider: string,
  type: 'CREDIT',
  timestamp : Date,
  userId : string
}


//recent transations for current user
export async function getonRampHistory(userId: string, count: number = 25): Promise<onRampInterface[]> {
  const cachedKey = `onRampHistory:${userId}`;
  
  try {
    // 1. Try to get from cache first
    const cachedHistory = await redis.lrange(cachedKey, 0, count - 1);
    
      if (cachedHistory && cachedHistory.length > 0) {
      return cachedHistory.map(item => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item) as onRampInterface;
          } catch (parseError) {
            console.error('Error parsing JSON string:', parseError, 'Item:', item);
            return null;
          }
        } else if (typeof item === 'object' && item !== null) {
          // Already an object, just cast it
          return item as onRampInterface;
        }

        return null;
      }).filter(item => item !== null) as onRampInterface[];
    }
    
    // 2. Cache miss - warm the cache synchronously
    const warmedData = await warmOnRampHistoryOnDemand(userId, count);
    
    // 3. Return the freshly warmed data
    return warmedData;
    
  } catch (error) {
    console.error('Error in getonRampHistory:', error);
    return [];
  }
}

// for a new successful transaction
export async function addonRampHistory(userId : string , transaction: onRampInterface) : Promise<void>{
  const cahedKey = `onRampHistory:${userId}`;
  try {
    // add new tr. to the front of the list
    // stringify the object bcz Redis lists store strings
    await redis.lpush(cahedKey, JSON.stringify(transaction));

    //  / 2. Trim the list to keep it from growing infinitely.
    // This keeps only the first 50 elements (0 to 49).
     await redis.ltrim(cahedKey, 0, MAX_HISTORY-1);
      

  }catch (error){
    return;
  }
}

export async function getP2pHistory(userId: string, count: number = 25): Promise<p2pInterface[]> {
  const cachedKey = `p2pHistory:${userId}`;
  
  try {
    // 1. Try to get from cache first
    const cachedHistory = await redis.lrange(cachedKey, 0, count - 1);
    
    if (cachedHistory && cachedHistory.length > 0) {
      return cachedHistory.map(item => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item) as p2pInterface;
          } catch (parseError) {
            console.error('Error parsing JSON string:', parseError, 'Item:', item);
            return null;
          }
        } else if (typeof item === 'object' && item !== null) {
          // Already an object, just cast it
          return item as p2pInterface;
        }

        return null;
      }).filter(item => item !== null) as p2pInterface[];
    }
    
    // 2. Cache miss - warm the cache synchronously
    const warmedData = await warmP2pHistoryOnDemand(userId, count);
    
    // 3. Return the freshly warmed data
    return warmedData;
    
  } catch (error) {
    console.error('Error in getP2pHistory:', error);
    return [];
  }
}

// for a new successful transaction
export async function addP2pHistory(userId : string , transaction: p2pInterface) : Promise<void>{
  const cahedKey = `p2pHistory:${userId}`;
  try {
    // add new tr. to the front of the list
    // stringify the object bcz Redis lists store strings
    await redis.lpush(cahedKey, JSON.stringify(transaction));

    //  / 2. Trim the list to keep it from growing infinitely.
    // This keeps only the first 50 elements (0 to 49).
     await redis.ltrim(cahedKey, 0, MAX_HISTORY-1);
      

  }catch (error){
    return;
  }
}





















