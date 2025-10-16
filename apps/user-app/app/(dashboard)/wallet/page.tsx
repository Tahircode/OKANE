import { getBalance, getOnRampTransactions } from "../addmoney/page";
import db from "@repo/db/client"
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
  LightBulbIcon,
  ClockIcon,
  CreditCardIcon,
  WalletIcon,
  BuildingLibraryIcon,
  StarIcon,
  FireIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";


// Function to fetch P2P transactions
async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  if (!userId) return [];
  
  // Get all P2P transfers where the user is either sender or receiver
  const p2pTransfers = await db.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    },
    include: {
      fromUser: { select: { name: true, email: true } },
      toUser: { select: { name: true, email: true } }
    },
    orderBy: { timestamp: 'desc' }
  });
  
  return p2pTransfers.map(transfer => {
    const isSent = transfer.fromUserId === userId;
    const otherUser = isSent ? transfer.toUser : transfer.fromUser;
    
    return {
      id: transfer.id,
      type: isSent ? "SENT" : "RECEIVED",
      amount: transfer.amount,
      timestamp: transfer.timestamp,
      status: "Success", // P2P transfers are always successful if they exist
      provider: otherUser?.name || otherUser?.email || "Unknown User",
      fromUserId: transfer.fromUserId,
      toUserId: transfer.toUserId
    };
  });
}

// Function to fetch all transactions and merge them
async function getAllTransactions() {
  const onRampTransactions = await getOnRampTransactions();
  const p2pTransactions = await getP2PTransactions();
  
  // Transform onRamp transactions to match the format
  const formattedOnRamp = onRampTransactions.map(tx => ({
    id: `onramp-${tx.time.getTime()}`,
    type: "ADDED",
    amount: tx.amount,
    timestamp: tx.time,
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Investment options data
const investmentOptions = [
  {
    name: "Fixed Deposits",
    description: "Secure investment with guaranteed returns",
    icon: BuildingLibraryIcon,
    color: "bg-blue-100 text-blue-600",
    returns: "6-7% p.a.",
    risk: "Low",
    link: "#"
  },
  {
    name: "Mutual Funds",
    description: "Diversified investment portfolio",
    icon: ChartBarIcon,
    color: "bg-green-100 text-green-600",
    returns: "10-12% p.a.",
    risk: "Medium",
    link: "#"
  },
  {
    name: "Crypto",
    description: "High potential returns with volatility",
    icon: CurrencyDollarIcon,
    color: "bg-purple-100 text-purple-600",
    returns: "15-20% p.a.",
    risk: "High",
    link: "#"
  },
  {
    name: "Gold Savings",
    description: "Traditional investment with stability",
    icon: StarIcon,
    color: "bg-yellow-100 text-yellow-600",
    returns: "8-9% p.a.",
    risk: "Low-Medium",
    link: "#"
  }
];

// Growth suggestions based on user behavior
const growthSuggestions = [
  {
    title: "Automate Your Savings",
    description: "Set up automatic transfers to grow your wallet consistently",
    icon: ClockIcon,
    action: "Set Up",
    link: "#"
  },
  {
    title: "Round-Up Purchases",
    description: "Save spare change from your transactions automatically",
    icon: SparklesIcon,
    action: "Enable",
    link: "#"
  },
  {
    title: "Refer & Earn",
    description: "Invite friends and earn rewards when they join",
    icon: FireIcon,
    action: "Invite",
    link: "#"
  }
];

export default async function Wallet() {
  const balance = await getBalance();
  const transactions = await getAllTransactions();

  const totalBalance = (balance?.amount || 0) + (balance?.locked || 0);

  // Separate successful and processing transactions
  const successfulTransactions = transactions.filter(t => t.status === "Success");
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

  // Calculate net growth
  const netGrowth = totalReceived + totalAdded - totalSent;
  const growthPercentage = totalAdded > 0 ? (netGrowth / totalAdded) * 100 : 0;

  // Calculate monthly transaction volume (simplified)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = successfulTransactions.filter(t => {
    const txnDate = new Date(t.timestamp);
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });
  
  const monthlyVolume = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0) / 100;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            My Wallet
          </h1>
          <p className="text-gray-600 text-lg">Manage your finances and grow your wealth</p>
        </div>

        {/* Balance Overview */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Balance</p>
              <p className="text-3xl sm:text-4xl font-bold">₹{(totalBalance / 100).toFixed(2)}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                netGrowth >= 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}>
                {netGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {netGrowth >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}% growth
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-xs font-medium mb-1">Available</p>
              <p className="text-xl font-semibold">₹{((balance?.amount || 0) / 100).toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-xs font-medium mb-1">Locked</p>
              <p className="text-xl font-semibold">₹{((balance?.locked || 0) / 100).toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-xs font-medium mb-1">Monthly Volume</p>
              <p className="text-xl font-semibold">₹{monthlyVolume.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Transaction Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 sm:p-3">
                <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Added</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalAdded.toFixed(2)}</p>
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
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalReceived.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-2 sm:p-3">
                <ArrowUpCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Sent</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">₹{totalSent.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2 sm:p-3">
                <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Net Growth</p>
                <p className={`text-lg sm:text-2xl font-bold truncate ${netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netGrowth >= 0 ? '+' : ''}₹{netGrowth.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Options */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Investment Options</h2>
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {investmentOptions.map((option, index) => (
              <Link key={index} href={option.link} className="group">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100 h-full transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${option.color} mb-4`}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Returns</p>
                      <p className="text-sm font-medium text-gray-900">{option.returns}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Risk</p>
                      <p className="text-sm font-medium text-gray-900">{option.risk}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Growth Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Personalized Suggestions</h2>
              </div>
              
              <div className="space-y-4">
                {growthSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-2 mr-4">
                      <suggestion.icon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <Link href={suggestion.link} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        {suggestion.action} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <WalletIcon className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Savings Goal</h2>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-600">Monthly Target</p>
                  <p className="text-sm font-medium text-gray-900">₹5,000</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((monthlyVolume / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.min((monthlyVolume / 5000) * 100, 100).toFixed(0)}% of monthly target
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-sm font-medium text-gray-900">₹{monthlyVolume.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Last Month</p>
                  <p className="text-sm font-medium text-gray-900">₹3,250.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-sm font-medium text-gray-900">₹4,125.00</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link href="/addmoney" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Add Money
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/p2p" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowUpCircleIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Send Money</p>
            </Link>
            
            <Link href="/addmoney" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowDownCircleIcon className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Money</p>
            </Link>
            
            <Link href="/history" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ClockIcon className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">History</p>
            </Link>
            
            <Link href="#" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CreditCardIcon className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Cards</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}