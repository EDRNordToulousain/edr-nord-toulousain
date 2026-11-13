'use client';
import { useEffect } from 'react';

export function PwaRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/benevoles/sw.js', { scope: '/benevoles', updateViaCache: 'none' }).catch(() => {});
    }
  }, []);
  return null;
}
