'use client'
import { useState, Suspense } from "react";
import { 
  ClockIcon, 
  BellIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Create a separate component for the content that uses useSearchParams
function ComingSoonContent() {
  const searchParams = useSearchParams();
  const featureName = searchParams.get('feature');
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const features = [
    {
      name: "Electricity Bills",
      description: "Pay your electricity bills directly from your wallet",
      icon: "⚡",
      status: "Coming Soon"
    },
    {
      name: "Mobile Recharge",
      description: "Recharge your mobile phone with instant top-ups",
      icon: "📱",
      status: "Coming Soon"
    },
    {
      name: "Insurance Premiums",
      description: "Pay your insurance premiums on time, every time",
      icon: "🛡️",
      status: "In Development"
    },
    {
      name: "Mutual Fund Investments",
      description: "Invest in mutual funds with expert guidance",
      icon: "📈",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <ClockIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            {featureName ? `${featureName} is Coming Soon` : "New Features Coming Soon"}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             We&apos;re working hard to bring you exciting new features. Stay tuned for updates and be the first to know when they&apos;re available.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Feature Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
              <div className="flex items-center mb-6">
                <RocketLaunchIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">What&apos;s Coming Next</h2>
              </div>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="text-3xl mr-4">{feature.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center mb-6">
                <LightBulbIcon className="h-8 w-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Why You&apos;ll Love These Features</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Seamless Integration</h3>
                    <p className="text-sm text-gray-600">All new features will integrate perfectly with your existing wallet</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Enhanced Security</h3>
                    <p className="text-sm text-gray-600">Bank-level security for all your transactions and data</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Exclusive Rewards</h3>
                    <p className="text-sm text-gray-600">Get special rewards and cashback on new features</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">24/7 Support</h3>
                    <p className="text-sm text-gray-600">Round-the-clock customer support for all your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Notification Form */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
              <div className="flex items-center mb-4">
                <BellIcon className="h-8 w-8 mr-3" />
                <h2 className="text-2xl font-bold">Get Notified</h2>
              </div>
              
              <p className="mb-6 text-indigo-100">
                Be the first to know when these features are available. Enter your email below and we&apos;ll keep you updated.
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                        Notify Me
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <CheckCircleIcon className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">You&apos;re on the list!</h3>
                  <p className="text-indigo-100">We&apos;ll notify you as soon as these features are available.</p>
                </div>
              )}
            </div>

            {/* Available Features */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Now</h2>
              
              <div className="space-y-3">
                <Link href="/wallet" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl mr-3">💰</span>
                  <span className="font-medium text-gray-900">Wallet Dashboard</span>
                </Link>
                
                <Link href="/p2p" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl mr-3">💸</span>
                  <span className="font-medium text-gray-900">Send Money</span>
                </Link>
                
                <Link href="/addmoney" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl mr-3">💳</span>
                  <span className="font-medium text-gray-900">Add Money</span>
                </Link>
                
                <Link href="/history" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-xl mr-3">📊</span>
                  <span className="font-medium text-gray-900">Transaction History</span>
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Stay Connected</h2>
              <p className="text-gray-600 mb-4">Follow us on social media for the latest updates</p>
              
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                
                <a href="#" className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-200 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                
                <a href="#" className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2023 Your Wallet. All rights reserved.</p>
          <p className="mt-2">We&apos;re constantly working to improve your experience. Stay tuned for more exciting features!</p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
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

// Main page component with Suspense wrapper
export default function ComingSoonPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ComingSoonContent />
    </Suspense>
  );
}