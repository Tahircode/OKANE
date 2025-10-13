"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  TicketIcon,
  AcademicCapIcon,
  GiftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentTime) {
      const hour = currentTime.getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    }
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };


  if (!mounted || !currentTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header Section - Static version */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1 sm:mb-2 truncate">
                  Loading...
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Loading...</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs sm:text-sm text-gray-500">Current time</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">--:--</p>
              </div>
            </div>
          </div>

          {/* Loading skeleton for the rest of the content */}
          <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1 sm:mb-2 truncate">
                {greeting}, User!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">{formatDate(currentTime)}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs sm:text-sm text-gray-500">Current time</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatTime(currentTime)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-blue-100 font-medium truncate">Wallet Balance</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">₹12,450.00</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">12% from last month</span>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg ml-2 sm:ml-4">
                <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-green-100 font-medium truncate">Monthly Savings</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">₹3,250.00</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">8% from last month</span>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg ml-2 sm:ml-4">
                <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-purple-100 font-medium truncate">Rewards Points</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">2,450</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">Redeem now</span>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg ml-2 sm:ml-4">
                <GiftIcon className="h-5 w-5 sm:h-6 sm:w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-orange-100 font-medium truncate">Active Offers</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">12</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <FireIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">Expiring soon</span>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white/20 p-2 sm:p-3 rounded-lg ml-2 sm:ml-4">
                <TicketIcon className="h-5 w-5 sm:h-6 sm:w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                name: "Send Money",
                href: "/p2p",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
                color: "bg-blue-100 text-blue-600 hover:bg-blue-200"
              },
              {
                name: "Add Money",
                href: "/addmoney",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
                color: "bg-green-100 text-green-600 hover:bg-green-200"
              },
              {
                name: "History",
                href: "/history",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                ),
                color: "bg-purple-100 text-purple-600 hover:bg-purple-200"
              },
              {
                name: "Wallet",
                href: "/wallet",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                  </svg>
                ),
                color: "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center p-3 sm:p-4 lg:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${item.color}`}
              >
                {item.icon}
                <span className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-900 text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bill Payments */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bill Payments</h2>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <ExclamationTriangleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              2 bills due soon
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                name: "Electricity Bill",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                  </svg>
                ),
                status: "Due in 3 days",
                statusColor: "text-red-600 bg-red-100"
              },
              {
                name: "LIC Insurance",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                ),
                status: "Due in 10 days",
                statusColor: "text-yellow-600 bg-yellow-100"
              },
              {
                name: "EMI / Loans",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                ),
                status: "Paid",
                statusColor: "text-green-600 bg-green-100"
              },
              {
                name: "View Products",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                ),
                status: "Active",
                statusColor: "text-blue-600 bg-blue-100"
              }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg mb-2 sm:mb-3">
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center truncate w-full">{item.name}</span>
                <span className={`mt-2 inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${item.statusColor}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Orders & Booking */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Orders & Booking</h2>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              3 active bookings
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                name: "Flight Booking",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                ),
                badge: "20% off"
              },
              {
                name: "Cab Booking",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                badge: "New"
              },
              {
                name: "Food Orders",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
                  </svg>
                ),
                badge: "Free delivery"
              },
              {
                name: "Shopping",
                href: "/upcoming",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                ),
                badge: "Sale"
              }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative"
              >
                {item.badge && (
                  <span className="absolute top-1 sm:top-2 right-1 sm:right-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg mb-2 sm:mb-3">
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 text-center truncate w-full">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Special Offers for Students */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold">Special Offers for Students</h2>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              <AcademicCapIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Verified Student
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                name: "EMI at 0% Interest",
                description: "No cost EMI on all purchases above ₹5000",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                ),
                href: "/offers/emi-zero-interest"
              },
              {
                name: "Student Exclusive Deals",
                description: "Special discounts just for students",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375m0-11.25v11.25m0 0h-9m-9 0V9m3 3h6m6-6h-6m6 6v6m-18 0v-6m9 6h6" />
                  </svg>
                ),
                href: "/offers/student-exclusive"
              }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-lg truncate">{item.name}</h3>
                  <p className="text-indigo-100 text-xs sm:text-sm truncate">{item.description}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-4 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Offer */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Today's Offer</h2>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>Ends in 14:32:45</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                name: "Special Cashback",
                description: "Get 20% cashback on all bill payments",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                ),
                discount: "20% OFF",
                href: "/upcoming"
              },
              {
                name: "Limited Time Deal",
                description: "Exclusive offers on flight bookings",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 sm:size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
                discount: "₹500 OFF",
                href: "/upcoming"
              }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-bl-lg">
                  {item.discount}
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 text-white flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-lg truncate">{item.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{item.description}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}