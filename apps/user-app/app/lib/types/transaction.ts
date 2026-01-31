
export type TransactionType = {
    id: string;
    fromUserId: string | null; 
    toUserId: string | null;   
    amount: number;               
    timestamp: Date;
    status: "Success" | "Failure" | "Processing",
    provider : string,
    userId : string,
    type:  "CREDIT" | "DEBIT"
  };
  export type TransactionArray = TransactionType[];
  