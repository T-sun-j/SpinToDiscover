import './globals.css';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'SpinLinX',
  description: 'Spin. Discover. Connect.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <LanguageProvider>
          {/* Wrap AuthProvider and its subtree in Suspense to satisfy Next.js CSR bailout requirements when using useSearchParams */}
          <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
