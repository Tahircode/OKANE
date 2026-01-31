import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { getonRampHistory } from "@repo/db";
import { getP2pHistory } from "@repo/db";

export async function getAllTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const onRampTransactions = await getonRampHistory(userId);  
  const p2pTransactions = await getP2pHistory(userId);
  
  // Transform onRamp transactions to match the format
  const formattedOnRamp = onRampTransactions.map(tx => ({
    id: `onramp-${tx.timestamp}`,
    type: "ADDED",
    amount: tx.amount,
    timestamp: tx.timestamp,
    status: tx.status,
    provider: tx.provider
  }));
  
  // Merge all transactions
  const allTransactions = [...formattedOnRamp, ...p2pTransactions];
  
  // Sort by timestamp (newest first)
  return allTransactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}


export async function getOnRampTransactions(){
   const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const onRampTransactions = await getonRampHistory(userId);
  const formattedOnRamp = onRampTransactions.map(tx => ({
    id: `onramp-${tx.timestamp}`,
    type: "ADDED" as const,
    amount: tx.amount,
    timestamp: tx.timestamp,
    status: tx.status,
    provider: tx.provider
  }));
  return formattedOnRamp.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}