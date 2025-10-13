
"use client";

import { useEffect } from "react";
import { AppbarClient } from "../components/AppbarClient";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status } = useSession();
  console.log("this->",status);

  const isAuthenticated = status === "authenticated";
  const authPaths = ["/auth/signin", "/auth/signup"];

  useEffect(() => {
    if (isAuthenticated && authPaths.includes(pathname)) {
      console.log(`User navigated to ${pathname} while logged in. Signing out.`);
      signOut({ callbackUrl: "/auth/signin" });
    }
  }, [pathname, isAuthenticated]);

  return (
    <>
      <AppbarClient />
      {children}
    </>
  );
}