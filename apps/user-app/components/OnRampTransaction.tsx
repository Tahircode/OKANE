import { Card } from "@repo/ui/card";
import { 
    ArrowDownCircleIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    BanknotesIcon
} from "@heroicons/react/24/outline";

const getStatusIcon = (status: string) => {
    switch (status) {
        case "Success":
            return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
        case "Processing":
            return <ClockIcon className="h-5 w-5 text-yellow-500 animate-pulse" />;
        case "Failure":
            return <XCircleIcon className="h-5 w-5 text-red-500" />;
        default:
            return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Success":
            return "text-green-600 bg-green-50";
        case "Processing":
            return "text-yellow-600 bg-yellow-50";
        case "Failure":
            return "text-red-600 bg-red-50";
        default:
            return "text-gray-600 bg-gray-50";
    }
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: "Processing" | "Success" | "Failure",
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return (
            <Card title="Recent Transactions">
                <div className="text-center py-12">
                    <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No transactions yet</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Your transaction history will appear here once you start adding money.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Recent Transactions">
            <div className="space-y-3">
                {transactions.map((t, index) => (
                    <div 
                        key={t.time.toISOString() + index} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                                    <ArrowDownCircleIcon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium text-gray-900">Money Added</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                                        {getStatusIcon(t.status)}
                                        <span className="ml-1">{t.status}</span>
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>{t.provider}</span>
                                    <span>•</span>
                                    <span>{formatDate(t.time)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-lg font-semibold text-green-600">
                                +₹{(t.amount / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {transactions.length > 0 && (
                <div className="mt-4 pt-4 border-t text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        View all transactions →
                    </button>
                </div>
            )}
        </Card>
    );
}