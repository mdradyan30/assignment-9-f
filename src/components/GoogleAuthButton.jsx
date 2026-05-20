'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

// Fetches the Google profile, then hands name/email/photo to our backend
export default function GoogleAuthButton({ onSuccess, disabled }) {
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Pull the user's basic profile from Google
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch user info: ${res.status}`);
        }

        const profile = await res.json();

        if (!profile.email || !profile.name) {
          throw new Error('Missing required profile information');
        }

        await googleLogin({
          name: profile.name,
          email: profile.email,
          photoURL: profile.picture || null,
          googleId: profile.id,
        });

        toast.success(`Welcome, ${profile.given_name || profile.name}!`);
        onSuccess?.();
      } catch (err) {
        console.error('Google sign-in error:', err);
        toast.error(err.message || 'Google sign-in failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      toast.error('Google sign-in was cancelled or failed');
    },
    flow: 'implicit',
    scope: 'openid profile email',
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-3 py-3 border border-base-300 hover:bg-base-200 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <FcGoogle size={18} />
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
