"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState, useEffect } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTranctions } from "../app/lib/actions/createOnRamptxn";
import { BanknotesIcon, ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState("");
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [amountInput, setAmountInput] = useState(""); // Separate state for the input

    const validateAmount = (value: string) => {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
            setError("Please enter a valid amount");
            return false;
        }
        if (num > 100000) {
            setError("Maximum amount is ₹1,00,000");
            return false;
        }
        setError("");
        return true;
    };

    const handleAmountChange = (value: string) => {
        setAmountInput(value);
        setAmount(value);
        if (value) validateAmount(value);
    };

    const handleAddMoney = async () => {
        if (!validateAmount(amount)) return;
        
        setLoading(true);
        setError("");
        
        try {
            await createOnRampTranctions(Number(amount), provider);
            // Show success message before redirect
            setTimeout(() => {
                window.location.href = redirectUrl || "";
            }, 1000);
        } catch (err) {
            setError("Failed to initiate transaction. Please try again.");
            setLoading(false);
        }
    };

    // Initialize the input with the amount value
    useEffect(() => {
        setAmountInput(amount);
    }, []);

    return (
        <Card title="Add Money to Wallet">
            <div className="space-y-6">
                {/* Amount Input */}
                <div>
                    <TextInput 
                        label={"Amount (₹)"} 
                        placeholder={"Enter amount"} 
                        onChange={handleAmountChange}
                    />
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
                        onSelect={(value) => {
                            const bank = SUPPORTED_BANKS.find(x => x.name === value);
                            setRedirectUrl(bank?.redirectUrl || "");
                            setProvider(bank?.name || "");
                        }} 
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
                        `Add ₹${amount || "0"}`
                    )}
                </Button>
            </div>
        </Card>
    );
}