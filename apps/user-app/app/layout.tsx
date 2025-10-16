import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OKANE", 
    template: "%s | OKANE", 
  },
  description: "A modern wallet for seamless P2P transfers and bill payments.",
  icons: {
    icon: {
      url: "/logo.png",
      sizes: "any",
      type: "image/png",
    },
    shortcut: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "OKANE - Your Digital Wallet",
    description: "A modern wallet for seamless P2P transfers and bill payments.",
    type: "website",
    locale: "en_US",
    url: "https://okane.vercel.app/", 
    siteName: "OKANE",
  },
  twitter: {
    card: "summary_large_image",
    title: "OKANE - Your Digital Wallet",
    description: "A modern wallet for seamless P2P transfers and bill payments.",
  },
};
export const viewport: Viewport = {
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-w-screen min-h-screen bg-white">
            <AppbarClient />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
