"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 8.841C34.522 4.982 29.582 3 24 3C12.438 3 3 12.438 3 24s9.438 21 21 21s21-9.438 21-21c0-1.872-0.219-3.708-0.613-5.467L43.611 20.083z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039L38.804 8.841C34.522 4.982 29.582 3 24 3C16.992 3 10.973 6.649 6.306 11.691z"></path>
    <path fill="#4CAF50" d="M24 45c5.582 0 10.522-1.982 14.804-5.196l-6.571-4.819C29.914 36.892 27.086 38 24 38c-5.223 0-9.65-3.657-11.303-8.309l-6.571 4.819C10.973 41.351 16.992 45 24 45z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.571 4.819C42.818 35.258 45 30.078 45 24c0-1.872-.219-3.708-.613-5.467L43.611 20.083z"></path>
  </svg>
);

 function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // Get error message directly from the URL query params
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      //  Credentials and callback URL are passed in the options object
      phone,
      password,
      callbackUrl,
      redirect: false // Crucial for client-side error handling
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setError("Invalid phone number or password.");
      } else {
        // Catch other errors like CLIENT_FETCH_ERROR
        setError(`Login failed: ${res.error}`);
      }
    } else if (res?.ok) {
      // Success: navigate to the desired page
      router.push(callbackUrl);
    }

  };


  const handleGoogleSignIn = () => {
    setLoading(true);
    // OAuth flow: starts redirect immediately
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-lg text-center shadow-inner">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 font-medium disabled:opacity-50 shadow-sm"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleSignin} className="space-y-4">
            <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1 font-mono">
               Phone Number
            </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
             <div className="relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1 font-mono">
              Password
            </label>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              required
            />

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye open icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.618 2.057-2.12 3.823-4.058 4.968m-3.484 1.32A9.98 9.98 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.955 9.955 0 012.28-3.434M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // Eye closed icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19a9.958 9.958 0 004.98-1.32M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" />
                </svg>
              )}
            </button>
          </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium shadow-md"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            New user?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 hover:text-indigo-500 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

}
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
export default function UpdateProfileFn() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Signin />
    </Suspense>
  );
}
