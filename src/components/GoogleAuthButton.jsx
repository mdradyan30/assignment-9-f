'use client';

import { signInWithGoogle } from '@/lib/auth-client';
import { getSafeRedirectURL } from '@/lib/redirect-utils';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useState } from 'react';

/**
 * GoogleAuthButton Component
 * Handles Google OAuth login with redirect support
 * 
 * @param {boolean} disabled - Whether the button is disabled
 * @param {string} redirectURL - URL to redirect to after successful login (must be relative)
 */
export default function GoogleAuthButton({ disabled = false, redirectURL = "/" }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (disabled || loading) return;
        setLoading(true);
        try {
            // Validate and get safe redirect URL before passing to OAuth
            const safeRedirectURL = getSafeRedirectURL(redirectURL, '/');
            await signInWithGoogle(safeRedirectURL);
            // Better Auth will handle redirect automatically to the callbackURL
            // When page returns from OAuth, AuthContext will fetch session on mount
        } catch (err) {
            toast.error(err.message || "Google sign in failed");
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || loading}
            className="w-full flex items-center justify-center gap-3 border border-base-300 rounded py-2.5 text-sm font-medium hover:bg-base-200 transition disabled:opacity-50"
        >
            <FcGoogle size={20} />
            {loading ? "Redirecting…" : "Continue with Google"}
        </button>
    );
}