import { getRedisClient } from "./redisClient";
import db from "../db";
const redis = getRedisClient();
export interface Contacts  {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
}
const TTL = 60 * 10;
export async function getContacts(userId: string): Promise<Contacts[]> {
   const cachedKey = `contacts:${userId}`;
    try {
        const cachedContacts = await redis.get<Contacts[]>(cachedKey);
        if(cachedContacts && cachedContacts.length>0){
            return cachedContacts;
        }
        const users = await db.user.findMany({
      where: {
        id: {
          not: userId
        }
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: 'asc'
      },
    });       
     if (users.length > 0) {
      await redis.set(cachedKey, JSON.stringify(users), { ex: TTL }); 
    }
    
    return users;

    }
    catch(error){
        return [];
    }
}
//write logic when someone deletes their account=>remove the user contact





