// lib/types/transaction.ts
export type Transaction = {
    id: string;
    fromUser: string | null; 
    toUser: string | null;   
    amount: number;               // in rupees (normalized)
    timestamp: Date;
  };
  export type TransactionArray = Transaction[];