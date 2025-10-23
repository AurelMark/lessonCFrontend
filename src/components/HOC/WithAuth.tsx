'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  const AuthGuard: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const hasToken = typeof document !== 'undefined' &&
        document.cookie.includes('token=');

      if (!hasToken) {
        router.replace('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthGuard;
}
