import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import '@/styles/globals.css';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Prompt Manager',
  description: 'Gerencie seus prompts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} flex h-dvh bg-gray-900 text-white antialiased`}
      >
        <NuqsAdapter>
          <Sidebar />
          <main className="relative min-w-0 flex-1 overflow-auto">
            <div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">
              {children}
            </div>
          </main>
          <Toaster position="top-right" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
