"use client"
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({children}: {children: React.ReactNode}) => {
   return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </SessionProvider>
    </QueryClientProvider>
  );
}
