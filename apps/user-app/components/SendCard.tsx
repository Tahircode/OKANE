// components/SendCard.tsx
import { useState, useEffect } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

interface SendCardProps {
  selectedContact?: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    image: string | null;
  } | null;
  clearSelectedContact: () => void;
  onTransferStart: () => void;
  onTransferSuccess: () => void;
  onTransferError: (error: string) => void;
}

export function SendCard({
  selectedContact,
  onTransferSuccess,
  onTransferError,
  onTransferStart,
  clearSelectedContact,
}: SendCardProps) {
  const [amount, setAmount] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; number?: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    recipient: string;
    amount: string;
  } | null>(null);

  // Quick amount options
  const quickAmounts = [100, 500, 1000, 2000];

  // Pre-fill the number when a contact is selected
  useEffect(() => {
    if (selectedContact?.phone) {
      setNumber(selectedContact.phone);
      setErrors(prev => ({ ...prev, number: undefined }));
    } else {
      setNumber("");
    }
  }, [selectedContact]);

  // Validate phone number
  // const validatePhoneNumber = (phone: string): boolean => {
  //   // Simple validation for Indian phone numbers
  //   const phoneRegex = /^[6-9]\d{9}$/;
  //   return phoneRegex.test(phone);
  // };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { amount?: string; number?: string } = {};
    
    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = "Please enter a valid amount";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount should be at least ₹1";
    } else if (Number(amount) > 100000) {
      newErrors.amount = "Maximum amount is ₹1,00,000";
    }
    
    if (!number) {
      newErrors.number = "Please enter a phone number";
    } 
    // else if (!validatePhoneNumber(number)) {
    //   newErrors.number = "Please enter a valid 10-digit phone number";
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!validateForm()) return;
    
    // Show confirmation modal
    setTransactionDetails({
      recipient: selectedContact?.name || number,
      amount: amount
    });
    setShowConfirmation(true);
  };

  // Confirm and process transfer
  const confirmTransfer = async () => {
    setLoading(true);
    onTransferStart(); // Notify parent that transfer has started
    
    try {
      const result = await p2pTransfer(number, Number(amount) * 100);
      if (result && typeof result === "object" && "success" in result) {
        if (result.success) {
          onTransferSuccess();
          setAmount("");
          setShowConfirmation(false);
        } else {
          onTransferError(result.message || "Transfer failed");
        }
      } else {
        onTransferError("Invalid response from server");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      onTransferError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle clear contact: reset everything to original state
  const handleClearContact = () => {
    setNumber("");
    setAmount("");
    setErrors({});
    clearSelectedContact();
  };

  // Handle quick amount selection
  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setErrors(prev => ({ ...prev, amount: undefined }));
  };

  // Format amount with rupee symbol
  const formatAmount = (value: string) => {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 w-full max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BanknotesIcon className="h-5 w-5 mr-2 text-indigo-600" />
          Send Money
        </h3>

        {/* Selected Contact Display */}
        {selectedContact && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {selectedContact.image ? (
                  <img
                    src={selectedContact.image}
                    alt={selectedContact.name || "User"}
                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 flex-shrink-0">
                    <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedContact.name ||
                      `User ${selectedContact.phone?.slice(-4)}`}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {selectedContact.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-3 w-3 mr-1" />
                        <span>{selectedContact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <button
                onClick={handleClearContact}
                disabled={loading}
                className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 text-sm font-medium ml-2 disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Recipient Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                  setErrors(prev => ({ ...prev, number: undefined }));
                }}
                placeholder="Enter 10-digit number"
                disabled={!!selectedContact?.phone || loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.number
                    ? "border-red-500 focus:ring-red-500"
                    : selectedContact?.phone || loading
                    ? "bg-gray-100 text-gray-500 border-gray-300"
                    : "border-gray-300 text-gray-900"
                }`}
              />
              {errors.number && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
              {selectedContact?.phone && !loading && (
                <button
                  onClick={handleClearContact}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">{errors.number}</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(value);
                  setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                placeholder="0.00"
                disabled={loading}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.amount
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                } disabled:bg-gray-100 disabled:text-gray-500`}
              />
              {errors.amount && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
            
            {/* Quick Amount Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
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
          </div>

          {/* Send Button */}
          <button
            onClick={handleTransfer}
            disabled={loading || !amount || !number}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0
                       C5.373 0 0 5.373 0 12h4zm2 5.291
                       A7.962 7.962 0 014 12H0
                       c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Send Money"
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && transactionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full mb-4">
              <BanknotesIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Confirm Transfer
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Recipient:</span>
                <span className="text-sm font-medium text-gray-900">
                  {transactionDetails.recipient}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{formatAmount(transactionDetails.amount)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">
              This action cannot be undone. Are you sure you want to proceed?
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
                onClick={confirmTransfer}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0
                           C5.373 0 0 5.373 0 12h4zm2 5.291
                           A7.962 7.962 0 014 12H0
                           c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
    </>
  );
}