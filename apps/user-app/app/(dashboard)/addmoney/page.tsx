import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BanknotesIcon, ArrowTrendingUpIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import type { OnRampTransaction } from "@prisma/client";


export async function getBalance() {
   const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: session?.user?.id
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: session?.user?.id
        },
        orderBy: {
            startTime: 'desc'
        },
        take: 10 // Limit to last 10 transactions
    });
    return txns.map((t : OnRampTransaction)  => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Add Money
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Top up your wallet securely from your bank account
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <BanknotesIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                                <p className="text-2xl font-bold text-gray-900">₹{(balance.amount / 100).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                <LockClosedIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Locked Balance</p>
                                <p className="text-2xl font-bold text-gray-900">₹{(balance.locked / 100).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                                <p className="text-2xl font-bold text-gray-900">₹{((balance.amount + balance.locked) / 100).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <AddMoney />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <BalanceCard amount={balance.amount} locked={balance.locked} />
                        <OnRampTransactions transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}