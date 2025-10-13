
// components/SendCard.tsx
import { useState, useEffect } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
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

  // Pre-fill the number when a contact is selected
  useEffect(() => {
    if (selectedContact?.phone) setNumber(selectedContact.phone);
    else setNumber("");
  }, [selectedContact]);

  // Handle transfer
  const handleTransfer = async () => {
    if (!amount || !number) return;
    setLoading(true);
    onTransferStart(); // Notify parent that transfer has started
    
    try {
      const result = await p2pTransfer(number, Number(amount) * 100);
      if (result && typeof result === "object" && "success" in result) {
        if (result.success) {
          onTransferSuccess();
          setAmount("");
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

  // Handle clear contact : reset everything to original state
  const handleClearContact = () => {
    setNumber("");
    setAmount("");
    clearSelectedContact();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Money</h3>

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
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter Number"
              disabled={!!selectedContact?.phone || loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selectedContact?.phone || loading
                  ? "bg-gray-100 text-gray-500 border-gray-300"
                  : "border-gray-300 text-gray-900"
              }`}
            />
            {selectedContact?.phone && !loading && (
              <button
                onClick={handleClearContact}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
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
  );
}
// import { useState, useEffect } from "react";
// import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
// import {
//   UserCircleIcon,
//   PhoneIcon,
//   EnvelopeIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// interface SendCardProps {
//   selectedContact?: {
//     id: string;
//     name: string | null;
//     phone: string | null;
//     email: string | null;
//     image: string | null;
//   } | null;
//   clearSelectedContact: () => void;
//   onTransferSuccess: () => void;
//   onTransferError: (error: string) => void;
// }

// export function SendCard({
//   selectedContact,
//   onTransferSuccess,
//   onTransferError,
//   clearSelectedContact,
// }: SendCardProps) {
//   const [amount, setAmount] = useState("");
//   const [number, setNumber] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Pre-fill the number when a contact is selected
//   useEffect(() => {
//     if (selectedContact?.phone) setNumber(selectedContact.phone);
//     else setNumber("");
//   }, [selectedContact]);

//   // Handle transfer
//   const handleTransfer = async () => {
//     if (!amount || !number) return;
//     setLoading(true);
//     try {
//       const result = await p2pTransfer(number, Number(amount) * 100);
//       if (result && typeof result === "object" && "success" in result) {
//         if (result.success) {
//           onTransferSuccess();
//           setAmount("");
//         } else {
//           onTransferError(result.message || "Transfer failed");
//         }
//       } else {
//         onTransferError("Invalid response from server");
//       }
//     } catch (err) {
//       console.error("Transfer error:", err);
//       onTransferError("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle clear contact : reset everything to original state
//   const handleClearContact = () => {
//     setNumber("");
//     setAmount("");
//     clearSelectedContact();
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 w-full max-w-md mx-auto">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Money</h3>

//       {/* Selected Contact Display */}
//       {selectedContact && (
//         <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3 flex-1 min-w-0">
//               {selectedContact.image ? (
//                 <img
//                   src={selectedContact.image}
//                   alt={selectedContact.name || "User"}
//                   className="h-10 w-10 rounded-full object-cover flex-shrink-0"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 flex-shrink-0">
//                   <UserCircleIcon className="h-6 w-6 text-indigo-600" />
//                 </div>
//               )}

//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {selectedContact.name ||
//                     `User ${selectedContact.phone?.slice(-4)}`}
//                 </p>
//                 <div className="flex items-center space-x-2 text-xs text-gray-500">
//                   {selectedContact.phone && (
//                     <div className="flex items-center">
//                       <PhoneIcon className="h-3 w-3 mr-1" />
//                       <span>{selectedContact.phone}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Clear Button */}
//             <button
//               onClick={handleClearContact}
//               className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 text-sm font-medium ml-2"
//             >
//               <XMarkIcon className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Input Fields */}
//       <div className="space-y-4">
//         {/* Recipient Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Recipient Number
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               value={number}
//               onChange={(e) => setNumber(e.target.value)}
//               placeholder="Enter Number"
//               disabled={!!selectedContact?.phone}
//               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                 selectedContact?.phone
//                   ? "bg-gray-100 text-gray-500 border-gray-300"
//                   : "border-gray-300 text-gray-900"
//               }`}
//             />
//             {selectedContact?.phone && (
//               <button
//                 onClick={handleClearContact}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
//               >
//                 <XMarkIcon className="h-4 w-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Amount Input */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Amount (₹)
//           </label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         {/* Send Button */}
//         <button
//           onClick={handleTransfer}
//           disabled={loading || !amount || !number}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center">
//               <svg
//                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0
//                      C5.373 0 0 5.373 0 12h4zm2 5.291
//                      A7.962 7.962 0 014 12H0
//                      c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               <span>Processing...</span>
//             </div>
//           ) : (
//             "Send Money"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }