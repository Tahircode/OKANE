import { Card } from "@repo/ui/card";
import { BanknotesIcon, LockClosedIcon, WalletIcon } from "@heroicons/react/24/outline";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    const totalBalance = amount + locked;
    const lockedPercentage = totalBalance > 0 ? (locked / totalBalance) * 100 : 0;

    return (
        <Card title="Balance Overview">
            <div className="space-y-4">
                {/* Available Balance */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-green-100 rounded-lg p-2 mr-3">
                            <BanknotesIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Available Balance</p>
                            <p className="text-xl font-bold text-gray-900">₹{(amount / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Locked Balance */}
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 rounded-lg p-2 mr-3">
                            <LockClosedIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Locked Balance</p>
                            <p className="text-xl font-bold text-gray-900">₹{(locked / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Total Balance */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                                <WalletIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                                <p className="text-2xl font-bold text-indigo-600">₹{(totalBalance / 100).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {totalBalance > 0 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{lockedPercentage.toFixed(1)}% Locked</span>
                                <span>{(100 - lockedPercentage).toFixed(1)}% Available</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${lockedPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}