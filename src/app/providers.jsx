'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              borderRadius: '12px',
              background: 'hsl(var(--n))',
              color: 'hsl(var(--nc))',
              fontWeight: 500,
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
