'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          fontSize: '16px',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    />
  );
}
