'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/auth/LoginPage';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect to dashboard
  }

  return <LoginPage />;
}
