'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from './Spinner';

// Wrap any private page in <ProtectedRoute>…</ProtectedRoute>
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Remember where the user wanted to go
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <Spinner fullScreen label="Checking your session…" />;
  }

  if (!user) {
    return <Spinner fullScreen label="Redirecting to login…" />;
  }

  return children;
}
