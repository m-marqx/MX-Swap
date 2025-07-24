import React from 'react';
import type { Metadata } from 'next'
import '@reown/appkit-wallet-button/react'
import { headers } from 'next/headers'
import ContextProvider from '@/src/components/WalletConnect/context';
import "@/src/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'Pandora Swap',
  description: 'Powered by Archie Marques',
  icons: {
    icon: '/icons/logo.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body className="bg-background-color w-full h-full text-primary-text-color">
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}