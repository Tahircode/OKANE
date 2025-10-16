"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home } from "lucide-react";
import { 
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// --- A separate component for the contact prompts for cleaner code ---
function ContactPrompts({ needsEmail, needsPhoneNumber }: { needsEmail: boolean; needsPhoneNumber: boolean }) {
  if (!needsEmail && !needsPhoneNumber) return null;

  return (
    <div className="flex items-center gap-2">
      {needsEmail && (
        <Link href="/update-profile?field=email">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium 
            bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
            hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
          >
            <EnvelopeIcon className="h-3 w-3" />
            Add Email
          </button>
        </Link>
      )}
      
      {needsPhoneNumber && (
        <Link href="/update-profile?field=phone">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium 
            bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg 
            hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
          >
            <PhoneIcon className="h-3 w-3" />
            Add Phone for Transactions
          </button>
        </Link>
      )}
    </div>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // --- Session handling ---
  const user = session?.user;
  const isUserAuthenticated = status === "authenticated";
  const isUserLoading = status === "loading";

  // --- Extract contact details from session ---
  // NOTE: For type safety, you should extend the next-auth session types.
  // See my previous answer on creating a `types/next-auth.d.ts` file.
  const contactEmail = user?.email;
  const contactPhone = (user as any)?.phone; // Using 'as any' for now, but fix this!

  // --- Determine which prompts to show ---
  const needsPhoneNumber = isUserAuthenticated && !contactPhone;
  const needsEmail = isUserAuthenticated && !contactEmail;

  // --- Page check for Home button ---
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="flex items-center justify-between w-full p-4">
      {/* Left Side: Home Button */}
      {!isDashboard && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
      )}

      {/* Main content (flex-1 makes it take up available space) */}
      <div className="flex-1 text-center">
        {children}
      </div>

      {/* Right Side: Contact Prompts */}
      {!isUserLoading && (
        <ContactPrompts 
          needsEmail={needsEmail} 
          needsPhoneNumber={needsPhoneNumber} 
        />
      )}

      {/* Show a simple loading indicator while session loads */}
      {isUserLoading && (
        <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
      )}
    </div>
  );
}