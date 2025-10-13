// lib/types/transaction.ts
export type Transaction = {
    id: string;
    fromUser: string | null; // sender's email or number
    toUser: string | null;   // receiver's email or number
    amount: number;               // in rupees (normalized)
    timestamp: Date;
  };
  export type TransactionArray = Transaction[];