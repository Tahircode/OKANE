// lib/actions/getContacts.ts
"use server";

import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getContacts() {
  const itself= await getServerSession(authOptions);
  // console.log(itself)
  try {
    const users = await db.user.findMany({
      where:{
        NOT:{
          id: itself?.user.id
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
      }
    });
    
    // Convert the database response to match your expected type
    return users.map(user => ({
      id: user.id.toString(), 
      name: user.name,
      phone: user.phone,
      email: user.email,
      image: user.image
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}