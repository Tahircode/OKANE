"use client";
import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

import { initialState, FormState } from "../../lib/types/form";
import { signUpAction } from "../../lib/auth/signup"


const SubmitButton = () => {

  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
    >
      {pending ? "Creating Account..." : "Sign Up"}
    </button>
  );
};


export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState<FormState, FormData>(signUpAction, initialState);

  useEffect(() => {
    if (state.success && state.credentials) {


      signIn("credentials",
        {
          phone: state.credentials.phone,
          password: state.credentials.password,
          callbackUrl: "/dashboard",
          redirect: false,
        }
      ).then((res) => {
        if (res?.ok) {
          router.push("/dashboard");
        } else {

          router.push("/auth/signin?error=SignupSuccessfulButLoginFailed");
        }
      });
    }
  }, [state, router]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h1>

        {/* Server Action Messages */}
        {state.message && (
          <div className={`mb-4 p-3 text-sm rounded-lg ${state.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`} role="alert">
            {state.message}
          </div>
        )}

        {/* The form action links directly to the Server Action via useFormState's result */}
        <form action={formAction} className="space-y-4">
          {/* Password Input */}
          <div>
            <label htmlFor="full name" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="aakash"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="9195937923"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              aria-describedby={state.errors?.phone ? 'phone-error' : undefined}
            />
            {state.errors?.phone && (
              <p id="phone-error" className="text-red-500 text-xs mt-1">{state.errors.phone[0]}</p>
            )}
          </div>

          {/* Password Input */}
          {/* Password Input with Show/Hide Toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
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

            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ chars, include uppercase, lowercase, number, and symbol.
            </p>
          </div>


          {/* Confirm Password Input */}
          {/* <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              aria-describedby={state.errors?.confirmPassword ? 'confirm-password-error' : undefined}
            />
            {state.errors?.confirmPassword && (
              <p id="confirm-password-error" className="text-red-500 text-xs mt-1">{state.errors.confirmPassword[0]}</p>
            )}
          </div> */}

          <SubmitButton />
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* OAuth Sign-In Buttons (these remain client-side) */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700">Continue with Google</span>
        </button>

        {/* <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all mt-3"
        >
          <img src="https://www.svgrepo.com/show/475654/github-color.svg" alt="GitHub" className="w-5 h-5 bg-white rounded-full p-0.5" />
          <span>Continue with GitHub</span>
        </button> */}

        {/* Link to Sign In page */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
