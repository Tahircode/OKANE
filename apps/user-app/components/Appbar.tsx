"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Session } from "next-auth";
import { 
  UserIcon, 
  Cog6ToothIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon
} from "@heroicons/react/24/outline";

interface AppbarProps {
  onSignin: () => void;
  onSignout: () => void;
  loading?: boolean;
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading"; 
}

export const Appbar = ({ onSignin, onSignout, loading, session, status }: AppbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (session?.user) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSignout = () => {
    setIsDropdownOpen(false);
    onSignout();
  };

  // Get user information from props
  const user = session?.user;
  const isUserAuthenticated = status === "authenticated";
  const isUserLoading = status === "loading" || loading;

  // Extract contact details from session 
  const contactEmail = user?.email;
  const contactPhone = (user as any)?.phone; 
  const userName = user?.name;
  const userImage = user?.image;

  // Check if user needs to add contact information
  const needsPhoneNumber = isUserAuthenticated && !contactPhone;
  const needsEmail = isUserAuthenticated && !contactEmail;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl 
      text-gray-900 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between z-50 
      bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl transition-all duration-300"
    >
      {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <span className="text-2xl md:text-3xl font-mono tracking-wide 
              bg-gradient-to-r from-green-600 to-emerald-400 text-transparent bg-clip-text 
              group-hover:from-green-700 group-hover:to-emerald-500 transition-all duration-300">
              OKANE
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-600 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </div>
          <span className="text-2xl text-black group-hover:rotate-12 transition-transform duration-300">お金</span>
        </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Add Contact Information Buttons - Only show when user is missing info */}
        <div className="flex items-center gap-2">
          {needsEmail && (
            <Link href="/update-profile?field=email">
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium 
                bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
              >
                <EnvelopeIcon className="h-3 w-3" />
                Add Email
              </button>
            </Link>
          )}
          
          {needsPhoneNumber && (
            <Link href="/update-profile?field=phone">
              <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium 
                bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg 
                hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
              >
                <PhoneIcon className="h-3 w-3" />
                Add Phone for Transactions
              </button>
            </Link>
          )}
        </div>

        {/* Notifications - Only show when logged in */}
        {isUserAuthenticated && (
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}

        {/* User Profile Section */}
        {isUserAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Avatar/Initial logic */}
              {userImage ? (
                <Image
                  src={userImage}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              
              {/* User Info - Hidden on mobile */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userName || "OKANE User"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {contactEmail || contactPhone || "No contact info"}
                </p>
              </div>
              
              <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{userName || "OKANE User"}</p>
                      <p className="text-sm text-blue-100 truncate">
                        {contactEmail || contactPhone || "No contact info"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {contactEmail ? (
                      <div className="flex items-center gap-3 text-sm">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 break-all">{contactEmail}</span>
                      </div>
                    ) : (
                      <Link 
                        href="/update-profile?field=email" 
                        className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Add Email for Updates</span>
                      </Link>
                    )}
                    
                    {contactPhone ? (
                      <div className="flex items-center gap-3 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{contactPhone}</span>
                      </div>
                    ) : (
                      <Link 
                        href="/update-profile?field=phone" 
                        className="flex items-center gap-3 text-sm text-amber-600 hover:text-amber-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                        <span>Add Phone Number</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link href="/update-profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    <span>Edit Profile</span>
                  </Link>
                  <Link href="/wallet" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    <span>Wallet</span>
                  </Link>
                  <Link href="/history" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    <span>Transaction History</span>
                  </Link>
                  <Link href="/upcoming" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                    <span>Settings</span>
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={handleSignout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Login Button */
          <button
            onClick={onSignin}
            disabled={isUserLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md text-white
              bg-gradient-to-r from-blue-500 to-indigo-600 
              hover:from-blue-600 hover:to-indigo-700 
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2`}
          >
            {isUserLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <UserIcon className="h-4 w-4" />
                Login
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}