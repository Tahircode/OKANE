// "use server";

// import prisma from "@repo/db/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "./auth";
// import type { Transaction } from "./types/transaction";

// export default async function ts(): Promise<Transaction[] | null> {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) return null;

//   const data = await prisma.p2pTransfer.findMany({
//     orderBy: { timestamp: "desc" },
//     where: {
//       OR: [
//         { fromUserId: session.user.id },
//         { toUserId:session.user.id },
//       ],
//     },
//     include: {
//       fromUser: { select: { phone: true, email: true } },
//       toUser: { select: { phone: true, email: true } },
//     },
//   });

//   const updatedData: Transaction[] = data.map((txn  ) => ({
//     id: txn.id,
//     fromUserEmail: txn.fromUser.email ?? txn.fromUser.phone ?? null,
//     toUserEmail: txn.toUser.email ?? txn.toUser.phone ?? null,
//     amount: txn.amount / 100, // normalize amount
//     timestamp: txn.timestamp,
//   }));

//   return updatedData;
// }
