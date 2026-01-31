'use client'
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";
import { Appbar } from "./Appbar";
import { Session } from "next-auth";

//type for the props AppbarClient expects to pass to Appbar
interface AppbarPropsToPass {
  onSignin: () => void;
  onSignout: () => Promise<void>; // Ensure this matches AppbarClient's handleSignout type
  loading: boolean;
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading"; //  Use the explicit status type
}


export function AppbarClient() {
  // 1. Fetch the session data and status
  const { data: session, status } = useSession();


// React.useEffect(() => {
//   console.log("Session status:", status);
//   console.log("Session object:", session);
// }, [status, session]);

  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  

  // 2. Define handler for Sign In click
  const handleSignin = () => {
    router.push("/auth/signin");
  };

  // 3. Define handler for Sign Out click
  const handleSignout = async () => {
    setLoading(true);
    
    try {
      await signOut({ redirect: false }); 
      router.push("/auth/signin");     
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Determine the overall loading state
  const isGlobalLoading = status === "loading" || loading;
  
  // 5. Render the presentational component (Appbar)
  //  Cast the props object to the expected type *before* passing.
  // This explicitly ensures the compiler knows the full shape of the props being passed.
  const appbarProps: AppbarPropsToPass = {
    session: session,
    status: status as AppbarPropsToPass['status'], // Explicitly cast the status for maximum safety
    onSignin: handleSignin,
    onSignout: handleSignout,
    loading: isGlobalLoading,
  };
  
  return (
    <Appbar
      {...appbarProps}
    />
  );
}
