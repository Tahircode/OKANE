"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
      console.log(`User is already logged in. Redirecting to dashboard...`);
      // Instead of signing out, just redirect them
      window.location.href = "/dashboard";
    }
  }, [pathname, status]);

  return (
    <div className="min-w-screen min-h-screen bg-white">
      {children}
    </div>
  );
}
