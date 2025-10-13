// lib/actions/p2pTransfer.ts
"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
        return { success: false, message: "User not authenticated" };
    }

    const toUser = await prisma.user.findFirst({ where: { phone: to } });

    if (!toUser) {
        return { success: false, message: "User not found" };
    }

    if (session.user.id === toUser.id) {
        return { success: false, message: "You can't send money to yourself" };
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: from }
            });

            if (!fromBalance || fromBalance.amount < amount) {
                return { success: false, message: "Insufficient balance" };
            }

            await tx.balance.update({
                where: { userId: from },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            await tx.p2pTransfer.create({
                data: {
                    fromUserId: from,
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date(),
                }
            });

            return { success: true, message: "Transfer successful" };
        });

        // Return the transaction result here
        return result;

    } catch (error) {
        console.error("P2P Transfer Error:", error);
        
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }

        return { success: false, message: "Transaction failed" };
    }
}
