import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Sidebar } from '@/components/sidebar';

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
        <Sidebar />
        <main className="relative min-w-0 flex-1 overflow-auto">
          <div className="mx-auto h-full max-w-full p-4 sm:p-6 md:max-w-3xl md:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
