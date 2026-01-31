import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";

import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
export const metadata: Metadata = {
  title: {
    default: "OKANE", 
    template: "%s | OKANE", 
  },
  description: "A modern wallet for seamless P2P transfers and bill payments.",
  // icons: {
  //   icon: {
  //     url: "/logo.png",
  //     sizes: "any",
  //     type: "image/png",
  //   },
  //   shortcut: "/logo.png",
  //   apple: "/apple-touch-icon.png",
  // },
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
      <Providers>
      <body className={`${geistSans.variable} ${geistMono.variable}  min-h-screen`}>
      <AppbarClient />
          <main className="min-w-screen min-h-screen bg-white">
            {children}
          </main>
      </body>
      </Providers>
    </html>
  );
}
