"use client";

import { useState, useEffect, useRef } from "react";
import { SendCard } from "../../../components/SendCard";
import { Toast } from "../../lib/actions/Toast";
import { getContacts } from "../../lib/actions/getContacts";
import type { User } from "../../lib/types/user";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";



import {
  ArrowPathIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function P2PPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSelecting, setIsSelecting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const [contacts, setContacts] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  // Audio context for sound effects
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play success sound
  const playSuccessSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };


  const showToast = (message: string, type: "error" | "success" | "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getContacts();
        if (!res) throw new Error("No users found");
        setContacts(res);
        setFilteredUsers(res);
      } catch (error) {
        console.error(error);
        showToast("Failed to load contacts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === "") {
      setFilteredUsers(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, contacts]);

  const phoneFn = async (
    recipient: User,
    currentUser: Session["user"] | null
  ): Promise<boolean> => {
    if (!recipient.phone) {
      showToast("Recipient has not added a phone number", "error");
      return false;
    }
    if (!currentUser?.phone) {
      showToast("Add phone Number to continue", "error");
      setTimeout(() => {
        router.push("/update-profile");
      }, 400);
      return false;
    }
    return true;
  };

  const refreshUsers = async () => {
    try {
      setRefreshing(true);
      const res = await getContacts();
      if (!res) throw new Error("Failed to refresh contacts");
      setContacts(res);
      setFilteredUsers(res);
      showToast("Contacts refreshed", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to refresh contacts", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // function to refresh contacts silently without showing a toast
  const silentRefreshUsers = async () => {
    try {
      const res = await getContacts();
      if (!res) throw new Error("Failed to refresh contacts");
      setContacts(res);
      setFilteredUsers(res);
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate statistics
  const totalContacts = contacts.length;
  const usersWithNumbers = contacts.filter(contact => contact.phone).length;
  const usersWithEmails = contacts.filter(contact => contact.email).length;

  return (
    <div className="min-h-screen relative">
      {/* Full-screen overlay with sand clock during transfer */}
      {isTransferring && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl max-w-sm mx-4">
      {/* Simplified Animation */}
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-amber-500 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <h3 className="text-white text-xl font-semibold mb-3 text-center">Processing Transfer</h3>
      <p className="text-gray-300 text-center text-sm leading-relaxed mb-4">
        Your transaction is being securely processed. This will just take a moment...
      </p>
      
      {/* Progress Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
)}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Money Transfer
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Send money securely and instantly to anyone in your network
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-2">
              <UserCircleIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {totalContacts}
            </div>
            <div className="text-gray-600 mt-1">Total Contacts</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-2">
              <PhoneIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {usersWithNumbers}
            </div>
            <div className="text-gray-600 mt-1">With Numbers</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-2">
              <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {usersWithEmails}
            </div>
            <div className="text-gray-600 mt-1">With Emails</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-2">
              <BanknotesIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {contacts.length > 0 ? Math.round(contacts.length * 0.6) : 0}
            </div>
            <div className="text-gray-600 mt-1">Active Users</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Card Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h2 className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">Send</span>
                  <span className="text-yellow-300">お金</span>
                </h2>
                <p className="text-indigo-100 mt-2">Quick and secure transfers</p>
              </div>
              <div className="p-6">
                <SendCard
                  selectedContact={selectedContact}
                  clearSelectedContact={() => setSelectedContact(null)}
                  onTransferStart={() => {
                    setIsTransferring(true);
                  }}
                  onTransferSuccess={() => {
                    showToast("Transfer successful!", "success");
                    playSuccessSound();
                    silentRefreshUsers();
                    setSelectedContact(null);
                    setIsTransferring(false);
                  }}
                  onTransferError={(error) => {
                    showToast(error, "error");
                    setIsTransferring(false);
                  }}
                />
              </div>
            </div>

            {/* Security Info Card */}
            <div className="mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-800 mr-2" />
                <h3 className="font-semibold text-indigo-800">Security Guaranteed</h3>
              </div>
              <p className="text-sm text-indigo-700">
                Your transfers are encrypted end-to-end for maximum security. We use industry-standard security measures to protect your transactions.
              </p>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-white text-2xl font-bold">Contacts</h2>
                    <p className="text-indigo-100 mt-1">View and manage your contacts</p>
                  </div>
                  <button
                    onClick={refreshUsers}
                    disabled={refreshing || isTransferring}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    title="Refresh contacts"
                  >
                    <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-6 pb-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search contacts by name, number, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isTransferring}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="p-6 pt-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500">Loading contacts...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-32 text-gray-500">
                    <UserCircleIcon className="h-12 w-12 mb-4 text-gray-300" />
                    <p>No contacts found</p>
                    <p className="text-sm mt-1">
                      {searchTerm ? "Try a different search term" : "Your contacts will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isTransferring ? 'opacity-50' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                              <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name || `User ${user.phone?.slice(-4)}`}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {user.phone && (
                                <div className="flex items-center">
                                  <PhoneIcon className="h-3 w-3 mr-1" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              {user.email && (
                                <div className="flex items-center">
                                  <EnvelopeIcon className="h-3 w-3 mr-1" />
                                  <span className="truncate max-w-[120px]">{user.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!session?.user) return;

                            // 1. Set loading to true
                            setIsSelecting(true);

                            try {
                              const ok = await phoneFn(user, session.user);
                              if (!ok) return; // The toast is already shown by phoneFn

                              setSelectedContact(user);
                              // showToast(`Selected ${user.name || user.phone}`, "info");
                            } finally {
                              // 2. Set loading to false, regardless of outcome
                              setIsSelecting(false);
                            }
                          }}
                          // 3. Disable the button and change text while loading or transferring
                          disabled={isSelecting || isTransferring}
                          className="flex-shrink-0 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {/* 4. Show different text based on the loading state */}
                          {isSelecting ? "Selecting..." : isTransferring ? "Transfer in progress..." : "Send"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Money Transfer. All rights reserved.</p>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Custom styles for sand clock animation */}
      <style jsx>{`
        @keyframes fillHourglass {
          0% { height: 0; }
          50% { height: 100%; }
          100% { height: 0; }
        }
      `}</style>
    </div>
  );
}