"use client";

import {  useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { updateProfileAction } from "../../lib/auth/update";
import Link from "next/link";
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
    >
      {pending ? "Saving..." : "Continue"}
    </button>
  );
};

 function UpdateProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const focusField = searchParams.get('field') || 'both';

  const [state, formAction] = useActionState(updateProfileAction, {
    success: false,
    message: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Handle successful form submission
  useEffect(() => {
    if (state.success) {
      setIsSubmitting(true);
      
      // Update the session with the new user data
      const updateSessionData = async () => {
        try {
          // Force a session update to get the latest data from the server
           await updateSession({
            ...session,
            user: {
              ...session?.user,
              email: state.user?.email || session?.user?.email,
              phone: state.user?.phone || (session?.user)?.phone,
            }
          });
          // Add a small delay to show success message
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } catch (error) {
          console.error("Failed to update session:", error);
          // Even if session update fails, still redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      };

      updateSessionData();
    }
  }, [state, router, updateSession, session]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const showEmail = focusField === 'email' || focusField === 'both';
  const showPhone = focusField === 'phone' || focusField === 'both';
  
  const getTitle = () => {
    if (focusField === 'email') return "Add Your Email Address";
    if (focusField === 'phone') return "Add Your Phone Number";
    return "Complete Your Profile";
  };

  const getDescription = () => {
    if (focusField === 'email') return "Add your email to receive important updates, loan information, and notifications from financial institutions.";
    if (focusField === 'phone') return "Add your phone number for secure transactions and account verification.";
    return "Please add your contact information to get the most out of OKANE.";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-gray-600 mt-2">{getDescription()}</p>
        </div>

        {state.message && (
          <div className={`mb-4 p-3 text-sm rounded-lg text-center ${state.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`} role="alert">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {showEmail && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address {!session.user?.email && <span className="text-red-500">*</span>}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                defaultValue={session.user?.email || ''}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required={!session.user?.email}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                For important updates, loan offers, and financial notifications
              </p>
            </div>
          )}

          {showPhone && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number {!(session?.user)?.phone && <span className="text-red-500">*</span>}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 8806745641"
                defaultValue={(session?.user)?.phone || ''}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required={!(session?.user)?.phone}
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                For secure transactions and account verification
              </p>
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            I&apos;ll do this later
          </Link>
        </div>
      </div>
    </div>
  );
}
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
      <UpdateProfilePage />
    </Suspense>
  );
}