"use server"

import prisma from "@repo/db/client";
import { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTranctions(amount : number , provider : string){
          
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    const userId = session?.user.id;

    if(!userId){
        return {
            message: "you are not logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data:{
            userId : userId,
            amount : amount * 100,
            status: 'Processing',
            startTime: new Date(),
            token : token,
            provider,

        }
    })
    return {
        message : " OnRamp Transactions added"
    }
}