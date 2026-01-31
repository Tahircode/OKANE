import { getBalance } from "@repo/db";
import { getAllTransactions } from "../../lib/actions/getTransactions";
import { 
  BanknotesIcon, 
  LockClosedIcon, 
  ArrowDownCircleIcon, 
  ArrowUpCircleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const formatDate = (date?: Date | string | null) => {
  if (!date) return "—";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const formatTime = (date?: Date | string | null) => {
    if (!date) return "—";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Success":
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case "Processing":
      return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    case "Failure":
      return <XCircleIcon className="h-4 w-4 text-red-500" />;
    default:
      return <ClockIcon className="h-4 w-4 text-gray-500" />;
  }
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "SENT":
      return <ArrowUpCircleIcon className="h-6 w-6 text-red-600" />;
    case "RECEIVED":
      return <ArrowDownCircleIcon className="h-6 w-6 text-green-600" />;
    case "ADDED":
      return <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />;
    default:
      return <ClockIcon className="h-6 w-6 text-gray-600" />;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case "SENT":
      return "bg-red-100";
    case "RECEIVED":
      return "bg-green-100";
    case "ADDED":
      return "bg-blue-100";
    default:
      return "bg-gray-100";
  }
};

const getTransactionLabel = (type: string) => {
  switch (type) {
    case "SENT":
      return "Money Sent";
    case "RECEIVED":
      return "Money Received";
    case "ADDED":
      return "Money Added";
    default:
      return "Transaction";
  }
};

const getAmountColor = (type: string) => {
  switch (type) {
    case "SENT":
      return "text-red-600";
    case "RECEIVED":
      return "text-green-600";
    case "ADDED":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const getAmountPrefix = (type: string) => {
  switch (type) {
    case "SENT":
      return "-";
    case "RECEIVED":
    case "ADDED":
      return "+";
    default:
      return "";
  }
};

export default async function DashboardCard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const balance = await getBalance(userId);
  const transactions = await getAllTransactions();

  const totalBalance = (balance?.amount || 0) + (balance?.locked || 0);

  // Separate successful and processing transactions
  const successfulTransactions = transactions.filter(t => t.status ===  "Success");
  const processingTransactions = transactions.filter(t => t.status === "Processing");

  // Calculate statistics based on successful transactions only
  const totalSent = successfulTransactions
    .filter(t => t.type === "SENT")
    .reduce((sum, t) => sum + t.amount, 0) / 100;
    
  const totalReceived = successfulTransactions
    .filter(t => t.type === "RECEIVED")
    .reduce((sum, t) => sum + t.amount, 0) / 100;
    
  const totalAdded = successfulTransactions
    .filter(t => t.type === "ADDED")
    .reduce((sum, t) => sum + t.amount, 0) / 100;

  // Calculate processing amounts
  const processingAmount = processingTransactions
    .reduce((sum, t) => sum + t.amount, 0) / 100;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">View your wallet balance and complete transaction history</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 sm:p-3">
                <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Available Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{((balance?.amount || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-2 sm:p-3">
                <LockClosedIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Locked Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{((balance?.locked || 0) / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 sm:p-3">
                <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-indigo-600 truncate">₹{(totalBalance / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-2 sm:p-3">
                <ArrowUpCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Sent</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalSent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 sm:p-3">
                <ArrowDownCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Received</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalReceived}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 sm:p-3">
                <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Added</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalAdded}</p>
              </div>
            </div>
          </div>
          
          {processingTransactions.length > 0 && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-2 sm:p-3">
                  <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Processing</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-600 truncate">₹{processingAmount}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {processingTransactions.length} transaction{processingTransactions.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions History */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link href="/p2p" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium text-center">
                  Send Money →
                </Link>
                <Link href="/addmoney" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium text-center">
                  Add Money →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {transactions && transactions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg transition-colors ${
                      tx.status === "Processing" 
                        ? "bg-yellow-50 border border-yellow-200" 
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div className="flex-shrink-0">
                        <div className={`flex items-center justify-center h-10 w-10 rounded-full ${getTransactionColor(tx.type)}`}>
                          {getTransactionIcon(tx.type)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{getTransactionLabel(tx.type)}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === "Success" 
                              ? "bg-green-100 text-green-800"
                              : tx.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {getStatusIcon(tx.status)}
                            <span className="ml-1">{tx.status}</span>
                          </span>
                          {tx.status === "Processing" && (
                            <span className="text-xs text-yellow-600 font-medium">
                              Pending...
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="truncate">  {"provider" in tx ? tx.provider : "P2P"}
</span>
                          <span>•</span>
                          <span>{formatDate(tx.timestamp)}</span>
                          <span>•</span>
                          <span>{formatTime(tx.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className={`text-lg font-semibold ${
                        tx.status === "Processing" 
                          ? "text-yellow-600" 
                          : getAmountColor(tx.type)
                      }`}>
                        {getAmountPrefix(tx.type)}₹{Math.abs(tx.amount / 100).toFixed(2)}
                      </p>
                      {tx.status === "Processing" && (
                        <p className="text-xs text-yellow-600 mt-1">Awaiting confirmation</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No transactions yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your transaction history will appear here once you start using your wallet.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link href="/addmoney" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Money
                  </Link>
                  <Link href="/p2p" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Send Money
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}