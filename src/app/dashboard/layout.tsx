'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Header
        onMenuToggle={handleMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <div className="flex">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
