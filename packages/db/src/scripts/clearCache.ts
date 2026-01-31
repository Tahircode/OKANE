import "dotenv/config";
import { getRedisClient } from "../cache/redisClient";
const redis = getRedisClient();


async function clearCache(pattern : string) : Promise<void>{
 try{
   const keys = await redis.keys(pattern);
   if(!keys || keys.length === 0) return;
    await redis.del(...keys);
     console.log(`Cleared ${keys.length} keys for pattern: ${pattern}`);
}catch(e){
    console.log("error while clearing cache",e);
}
 }

async function main(){
    const patterns = ["*History:*", "*balance:*", "*user:profile:*","*contacts:*"];
    for(const p of patterns){
        await clearCache(p);
    }
}

main();


