'use server'
import {db} from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { getBalance } from "@repo/db";
import { p2pInterface } from "@repo/db";
import { invalidateBalance } from "@repo/db";
import { addP2pHistory } from "@repo/db";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const fromUserId = session?.user?.id;

    if (!fromUserId) {
        return { success: false, message: "User not authenticated" };
    }

    // Fetch details for BOTH users to create a complete transaction object
    const [fromUser, toUser] = await Promise.all([
        db.user.findUnique({ where: { id: fromUserId }, select: { id: true, name: true } }),
        db.user.findFirst({ where: { phone: to }, select: { id: true, name: true } })
    ]);

    if (!toUser) {
        return { success: false, message: "Recipient not found" };
    }
    
    if (!fromUser) {
        // This case should ideally not happen if the session is valid
        return { success: false, message: "Sender not found" };
    }

    if (fromUserId === toUser.id) {
        return { success: false, message: "You can't send money to yourself" };
    }

    try {
        // 1. Perform the atomic database transaction first
        const result = await db.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUserId} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: fromUserId }
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient balance");
            }

            await tx.balance.update({
                where: { userId: fromUserId },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            const newTransfer = await tx.p2pTransfer.create({
                data: {
                    fromUserId: fromUserId,
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date(),
                    status : "Success"
                }
            });

            return { success: true, message: "Transfer successful", transferId: newTransfer.id };
        });

        // 2. If the DB transaction was successful, update the cache
        if (result.success) {
            console.log(`[P2P] DB transaction successful. Updating cache.`);
            
            // Create COMPLETE transaction objects for caching
            const senderTransaction: p2pInterface = {
                id: result.transferId!,
                amount: -amount, // Sent money is a debit
                timestamp: new Date(),
                status: "Success",
                type: 'DEBIT',
                toUser: toUser.name || toUser.id, // Use name, fallback to ID
                toUserId: toUser.id,
                fromUser: fromUser.name || fromUser.id, // Use name, fallback to ID
                fromUserId: fromUserId,
            };

            const receiverTransaction: p2pInterface = {
                id: result.transferId!,
                amount: amount, // Received money is a credit
                timestamp: new Date(),
                status: "Success",
                type: 'CREDIT',
                toUser: toUser.name || toUser.id,
                toUserId: toUser.id,
                fromUser: fromUser.name || fromUser.id,
                fromUserId: fromUserId,
            };

            try {
                // Invalidate balance caches for both users
                await invalidateBalance(fromUserId);
                await invalidateBalance(toUser.id);
                //populate
                await getBalance(fromUserId);
                await getBalance(toUser.id);


                // Add the new transaction to both users' P2P history
                 addP2pHistory(fromUserId, senderTransaction);

                 addP2pHistory(toUser.id, receiverTransaction);

                console.log(`[P2P] Cache updated successfully.`);
            } catch (cacheError) {
                console.error("[P2P] Failed to update cache:", cacheError);
            }
        }

        return result;

    } catch (error) {
        console.error("P2P Transfer Error:", error);
        
        if (error instanceof Error && error.message === "Insufficient balance") {
            return { success: false, message: error.message };
        }
        
        return { success: false, message: "An unexpected error occurred during the transaction." };
    }
}