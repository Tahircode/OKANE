// components/p2ptransaction.tsx
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";

// Helper function to format the date in a more readable way
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const P2Ptransactions = ({
    transactions
}: {
    transactions: {
        id: number;
        fromUserEmail: string | null;
        toUserEmail: string | null;
        amount: number;
        timestamp: Date;
    }[]
}) => {
    if (!transactions.length) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                <ArrowUpCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No transactions yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Your transactions will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((t) => (
                <div 
                    key={t.id} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${t.fromUserEmail ? 'bg-red-100' : 'bg-green-100'}`}>
                                {t.fromUserEmail ? (
                                    <ArrowUpCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                ) : (
                                    <ArrowDownCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {t.fromUserEmail ? `Sent to ${t.toUserEmail}` : `Received from ${t.fromUserEmail}`}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(t.timestamp)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className={`text-sm font-semibold ${t.fromUserEmail ? 'text-red-600' : 'text-green-600'}`}>
                            {t.fromUserEmail ? '-' : '+'} Rs {t.amount.toFixed(2)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}