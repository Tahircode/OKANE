// types/transactions.d.ts

// Import Prisma types if you're using Prisma
import { PrismaClient } from '@prisma/client';

// Define your transaction types
export interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  fromUserId: string;
  toUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface P2PTransfer {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
}

// Define transaction function types
export type TransactionFunction = (tx: PrismaClient) => Promise<any>;

// Define array types
export type TransactionArray = Transaction[];
export type UserArray = User[];
export type P2PTransferArray = P2PTransfer[];