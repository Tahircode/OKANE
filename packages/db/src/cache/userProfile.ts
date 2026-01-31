import { getRedisClient } from "./redisClient";
import db from "../db";
const redis = getRedisClient();
export interface CachedProfile extends Record<string, unknown> {
    name : string | null ;
    email : string | null;
    image : string | null;
    phone : string | null;
} ;
export interface UserProfile {
  id: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  image?: string | null;
}

//@param -> userId.
//@returns -> user's profile object.

export async function getUserProfile(userId: string): Promise<CachedProfile | null> {
   const cacheKey = `user:profile:${userId}`;
   try {
    // hgetall -> hash get all
    const cachedProfile = await redis.hgetall<CachedProfile>(cacheKey);
      if(cachedProfile && Object.keys(cachedProfile).length>0){
        return cachedProfile;
      }

      const user = await db.user.findUnique({
        where :{id : userId},
        select : { name : true , email : true, phone : true , image : true},
      });
      if(!user){
        return null;
      }
    //populate redis hash
    await redis.hset(cacheKey,user);
    return user;
   }catch(error){
    const user = await db.user.findUnique({
        where : {id : userId},
        select : {name : true, email : true , phone : true , image : true}
    });
    return user;
}

}

//invalidate the cached Profile when updated
export async function invalidateUserProfile(userId : string): Promise<void>{
    const cachedKey = `user:profile:${userId}`;
    await redis.del(cachedKey);
}

//update user profile in cache

export async function updateUserProfileCache(userId : string, data : Partial<CachedProfile> ): Promise<void>{

const cachedKey = `user:profile:${userId}`;

  try {
    const existing = await redis.hgetall<CachedProfile>(cachedKey);
    const updated = { ...existing, ...data};
    await redis.hset(cachedKey, updated);
  }catch(e){
    console.error("Error updating user profile cache:", e);
  }
}







