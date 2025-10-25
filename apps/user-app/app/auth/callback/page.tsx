"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasHandled = useRef(false); // Prevents the effect from running multiple times

  useEffect(() => {
    // If we've already handled the redirect, do nothing.
    if (hasHandled.current) return;

    console.log("AuthCallback: Status is", status);

    // Set a timeout as a safety net. If the session status is still 'loading'
    // after 10 seconds, something is wrong.
    const timeoutId = setTimeout(() => {
      console.error("AuthCallback: Session status stuck on 'loading'. Redirecting to sign-in.");
      hasHandled.current = true; // Mark as handled
      router.push("/auth/signin?error=Timeout");
    }, 10000); // 10 seconds

    if (status === "authenticated") {
      clearTimeout(timeoutId); // Success! Cancel the timeout.
      hasHandled.current = true; // Mark as handled

      const callbackUrl = typeof window !== "undefined"
        ? sessionStorage.getItem("oauth_callback_url") || "/dashboard"
        : "/dashboard";

      console.log("AuthCallback: User authenticated, redirecting to:", callbackUrl);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("oauth_callback_url");
      }

      router.push(callbackUrl);
    } else if (status === "unauthenticated") {
      clearTimeout(timeoutId); // Failed! Cancel the timeout.
      hasHandled.current = true; // Mark as handled
      console.log("AuthCallback: User not authenticated, redirecting to sign-in with error.");
      router.push("/auth/signin?error=OAuthCallback");
    }

    // Cleanup function: clear the timeout if the component unmounts or status changes.
    return () => {
      clearTimeout(timeoutId);
    };
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
        <p className="text-xs text-gray-500 mt-2">This should only take a moment.</p>
      </div>
    </div>
  );
}