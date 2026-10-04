import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'SAT-SA | Supervisory Analytics Tool for SOC Assessment',
  description: 'National supervisory analytics platform for SOC operational oversight, evidence integrity verification, and execution-gap surveillance under Section 70A IT Act.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-warm-50 text-warm-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
