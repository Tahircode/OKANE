"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const callbackUrl = typeof window !== "undefined" 
      ? sessionStorage.getItem("oauth_callback_url") || "/dashboard"
      : "/dashboard";
  
    if (status === "authenticated") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("oauth_callback_url");
      }
      router.push(callbackUrl);
    } else if (status === "unauthenticated") {
      // For OAuth failures, redirect back to sign-in with error
      router.push("/auth/signin?error=OAuthCallback");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}