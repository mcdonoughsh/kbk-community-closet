'use client';

import { useEffect, useState } from 'react';
import { registerWebComponents } from '@/web-components/register';

interface WebComponentsProviderProps {
  children: React.ReactNode;
}

/**
 * WebComponentsProvider - Ensures Web Components are registered before rendering children
 * Must be used on client-side only
 */
export function WebComponentsProvider({ children }: WebComponentsProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    registerWebComponents();
    setIsReady(true);
  }, []);

  // Show nothing until Web Components are registered
  // This prevents hydration mismatches
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
