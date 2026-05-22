/**
 * useRedirect Hook
 * Simplifies redirect handling in components
 * 
 * @example
 * const { redirectToLogin, redirectTo, safeRedirect } = useRedirect();
 * 
 * // Redirect to login with current page as return URL
 * redirectToLogin();
 * 
 * // Redirect to a safe URL
 * redirectTo('/dashboard');
 * 
 * // Use safe redirect with fallback
 * safeRedirect(userProvidedURL, '/home');
 */

'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    createLoginRedirectURL,
    getSafeRedirectURL,
    getRedirectFromSearchParams,
    isValidRedirectURL,
    storeRedirectURL,
    getStoredRedirectURL,
} from '@/lib/redirect-utils';

export function useRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Redirects user to login page with current pathname as redirect
     */
    const redirectToLogin = (customPath = pathname) => {
        const loginURL = createLoginRedirectURL(customPath);
        router.replace(loginURL);
    };

    /**
     * Performs a safe redirect to a URL (validates first)
     */
    const redirectTo = (url, fallback = '/') => {
        const safeURL = getSafeRedirectURL(url, fallback);
        router.push(safeURL);
    };

    /**
     * Performs a safe replace redirect (replaces history instead of push)
     */
    const replaceTo = (url, fallback = '/') => {
        const safeURL = getSafeRedirectURL(url, fallback);
        router.replace(safeURL);
    };

    /**
     * Gets the redirect URL from query params with fallback
     */
    const getRedirectURL = (fallback = '/') => {
        return getRedirectFromSearchParams(searchParams, fallback);
    };

    /**
     * Validates if a URL is safe for redirect
     */
    const isValidRedirect = (url) => {
        return isValidRedirectURL(url);
    };

    /**
     * Stores a redirect URL in session storage
     */
    const storeRedirect = (url) => {
        storeRedirectURL(url);
    };

    /**
     * Retrieves a stored redirect URL
     */
    const getStoredRedirect = (fallback = '/') => {
        return getStoredRedirectURL(fallback);
    };

    /**
     * Gets the current pathname
     */
    const getCurrentPath = () => {
        return pathname;
    };

    return {
        redirectToLogin,
        redirectTo,
        replaceTo,
        getRedirectURL,
        isValidRedirect,
        storeRedirect,
        getStoredRedirect,
        getCurrentPath,
        router,
        searchParams,
    };
}
