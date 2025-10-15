
export type TransactionType = {
    id: string;
    fromUserId: string | null; 
    toUserId: string | null;   
    amount: number;               
    timestamp: Date;
    startTime: Date;
    status: "Success" | "Failure" | "Processing",
    provider : string,
    userId : string,
    type:  "CREDIT" | "DEBIT"
  };
  export type TransactionArray = TransactionType[];

  // model p2pTransfer {
  //   id         String    @id @default(cuid())
  //   amount     Int
  //   timestamp  DateTime
  //   fromUserId String
  //   fromUser   User         @relation(name: "FromUserRelation", fields: [fromUserId], references: [id])
  //   toUserId   String
  //   toUser     User         @relation(name: "ToUserRelation", fields: [toUserId], references: [id])
  // }
  // model OnRampTransaction {
  //   id        String    @id @default(cuid())
  //   status    OnRampStatus
  //   token     String          @unique
  //   provider  String
  //   amount    Int
  //   type      TransactionType @default(CREDIT)  
  //   startTime DateTime
  //   userId    String
  //   user      User            @relation(fields: [userId], references: [id])
  // }
  
  
  // model Balance {
  //   id     String    @id @default(cuid())
  //   userId String  @unique
  //   amount Int
  //   locked Int
  //   user   User @relation(fields: [userId], references: [id])
  // }
  // enum OnRampStatus {
  //   Success
  //   Failure
  //   Processing
  // }
  