"use client";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="flex flex-col items-center pt-28 px-4 ">
      <div className="w-full max-w-5xl flex flex-col gap-6 ">
        {children}
      </div>
    </div>
  );
}