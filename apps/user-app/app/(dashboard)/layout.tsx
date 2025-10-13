"use client";

import React from "react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center pt-28 px-4">
      {/* Top bar with Back button */}
      <div className="w-full max-w-5xl flex justify-start mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center font-mono gap-2 px-3 py-2 rounded-lg text-gray-700 font-medium shadow-sm border border-gray hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} /> 
          Back
        </button>
      </div>

      {/* Main content container aligned with Appbar */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}