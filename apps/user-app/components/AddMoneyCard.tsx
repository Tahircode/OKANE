"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState, useEffect } from "react";
import axios from 'axios'
import { TextInput } from "@repo/ui/textinput";
import { useRouter } from "next/navigation";
import { createOnRampTranctions } from "../app/lib/actions/createOnRamptxn";
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
    logo: "🏦"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
    logo: "🏛️"
}, {
    name: "ICICI Bank",
    redirectUrl: "https://www.icicibank.com/",
    logo: "💼"
}];

// Quick amount options
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export const AddMoney = () => {
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState("");
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [amountInput, setAmountInput] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<{
        amount: string;
        provider: string;
        token?: string;
    } | null>(null);

    // Validate amount
    const validateAmount = (value: string) => {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
            setError("Please enter a valid amount");
            return false;
        }
        if (num < 100) {
            setError("Minimum amount is ₹100");
            return false;
        }
        if (num > 100000) {
            setError("Maximum amount is ₹1,00,000");
            return false;
        }
        setError("");
        return true;
    };

    // Handle amount change
    const handleAmountChange = (value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        setAmountInput(numericValue);
        setAmount(numericValue);
        if (numericValue) validateAmount(numericValue);
    };

    // Handle quick amount selection
    const handleQuickAmount = (value: number) => {
        setAmountInput(value.toString());
        setAmount(value.toString());
        validateAmount(value.toString());
    };

    // Handle bank selection
    const handleBankSelect = (value: string) => {
        const bank = SUPPORTED_BANKS.find(x => x.name === value);
        setRedirectUrl(bank?.redirectUrl || "");
        setProvider(bank?.name || "");
    };

    // Handle add money click
    const handleAddMoney = () => {
        if (!validateAmount(amount)) return;

        // Show confirmation modal
        setTransactionDetails({
            amount: amount,
            provider: provider
        });
        setShowConfirmation(true);
    };

    // Confirm and process transaction
    const confirmTransaction = async () => {
        setLoading(true);
        setError("");

        try {
            const d = await createOnRampTranctions(Number(amount), provider);
            console.log("Transaction created:", d);

            // Update transaction details with token
            setTransactionDetails({
                amount: amount,
                provider: provider,
                token: d.token
            });

            // Notify the backend after the transaction token is received
            await axios.post('http://localhost:3004/hdfcwebhook', {
                token: `${d.token}`,
            });
            console.log("Webhook notification sent");

            // Show success state
            setTransactionSuccess(true);
            setShowConfirmation(false);

            // Reset form after a delay
            setTimeout(() => {
                setAmount("");
                setAmountInput("");
                setTransactionSuccess(false);
                router.refresh();
            }, 3000);

        } catch (error) {
            console.error("Error processing transaction:", error);
            setError("Transaction failed. Please try again.");
            setShowConfirmation(false);
        } finally {
            setLoading(false);
        }
    };

    // Initialize the input with the amount value
    useEffect(() => {
        setAmountInput(amount);
    }, []);

    // Format amount with rupee symbol
    const formatAmount = (value: string) => {
        if (!value) return "0";
        const num = Number(value);
        if (isNaN(num)) return "0";
        return new Intl.NumberFormat('en-IN').format(num);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card title="Add Money to Wallet">
                <div className="space-y-6">

                    {/* Amount Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="amount-input" className="block text-sm font-medium text-gray-700">
                                Amount (₹)
                            </label>
                            <span className="text-xs text-gray-500">
                                Min: ₹100 | Max: ₹1,00,000
                            </span>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">₹</span>
                            </div>
                            <input
                                id="amount-input"
                                type="text"
                                placeholder="0.00"
                                value={amountInput}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className={`w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {QUICK_AMOUNTS.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleQuickAmount(value)}
                                    disabled={loading}
                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                                >
                                    ₹{value}
                                </button>
                            ))}
                        </div>

                        {amount && !error && (
                            <p className="mt-2 text-sm text-green-600 flex items-center">
                                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                Secure transaction powered by {provider}
                            </p>
                        )}
                    </div>

                    {/* Bank Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Bank
                        </label>
                        <Select
                            onSelect={handleBankSelect}
                            options={SUPPORTED_BANKS.map(x => ({
                                key: `${x.logo} ${x.name}`,
                                value: x.name
                            }))}
                        />
                    </div>

                    {/* Security Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex">
                            <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Secure & Encrypted</p>
                                <p>Your transaction is protected with industry-standard encryption</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={handleAddMoney}
                        disabled={loading || !amount || !!error}
                        className="w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            `Add ₹${formatAmount(amount)}` 
                        )}
                    </Button>
                </div>
            </Card>

            {/* Confirmation Modal */}
            {showConfirmation && transactionDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full mb-4">
                            <BanknotesIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                            Confirm Transaction
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Amount:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    ₹{formatAmount(transactionDetails.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Bank:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {transactionDetails.provider}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 text-center">
                            You will be redirected to your bank's secure payment gateway to complete this transaction.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmTransaction}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing
                                    </div>
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {transactionSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Transaction Successful!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ₹{formatAmount(transactionDetails?.amount || "0")} has been added to your wallet.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-600">Transaction ID:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {transactionDetails?.token?.slice(0, 8)}...
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className="text-sm font-medium text-green-600">
                                    Completed
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            This window will close automatically...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}