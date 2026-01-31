import { getRedisClient } from "./redisClient";
import db from "../db";

const redis = getRedisClient();
const TTL = 60 * 5; // 5 mins
export interface Balance {
    amount : number,
    locked : number
}
//@param -> userId
//@returns -> balance
export async function getBalance(userId : string) : Promise<Balance>{
    const cacheKey = `balance:${userId}`;
    try {
        const cachedBalance = await redis.get<Balance>(cacheKey);

        if(cachedBalance){
            return cachedBalance;
        }
        const balanceRecord = await db.balance.findUnique({
            where : {userId},
            select : {amount : true, locked : true},
        });
        if(!balanceRecord){
            return {amount : 0, locked : 0};
        }
        //populating the cache with data
        // ex -> expiration
        await redis.set(cacheKey, JSON.stringify(balanceRecord), {ex: TTL});
        return {
            amount : balanceRecord.amount,
            locked : balanceRecord.locked
        }

    }catch(error){
    const balanceRecord = await db.balance.findUnique({ where: { userId }, select: { amount: true, locked: true } });
     return {
        amount : balanceRecord?.amount ?? 0,
        locked : balanceRecord?.locked ?? 0
     }
}
}

//invalidate cached balance when updated

export async function invalidateBalance(userId : string) : Promise<void>{
    const cachedKey = `balance:${userId}`;
    console.log("invalidateBalance key",cachedKey);
    await redis.del(cachedKey);
}







