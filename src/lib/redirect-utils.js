/**
 * Redirect Utilities
 * Provides safe URL handling and validation for post-login redirects
 */

/**
 * Validates if a URL is safe to redirect to (relative paths only)
 * Prevents open redirect attacks by ensuring URLs don't lead to external sites
 */
export function isValidRedirectURL(url) {
    if (!url || typeof url !== 'string') return false;

    // Allow only relative URLs starting with /
    if (!url.startsWith('/')) return false;

    // Prevent protocol-based redirects (like javascript: or http://)
    if (url.includes('://') || url.includes('javascript:')) return false;

    // Prevent double slashes that might indicate protocol
    if (url.startsWith('//')) return false;

    return true;
}

/**
 * Gets a safe redirect URL, with fallback to default
 */
export function getSafeRedirectURL(url, defaultURL = '/') {
    if (isValidRedirectURL(url)) {
        return url;
    }
    return defaultURL;
}

/**
 * Stores the intended redirect URL for later use
 * Useful for multi-step flows or complex redirects
 */
export function storeRedirectURL(url) {
    if (isValidRedirectURL(url)) {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('post_login_redirect', url);
        }
    }
}

/**
 * Retrieves and clears the stored redirect URL
 */
export function getStoredRedirectURL(defaultURL = '/') {
    if (typeof window === 'undefined') return defaultURL;

    const url = sessionStorage.getItem('post_login_redirect');
    sessionStorage.removeItem('post_login_redirect');

    return isValidRedirectURL(url) ? url : defaultURL;
}

/**
 * Creates a safe login redirect URL with encoded redirect parameter
 */
export function createLoginRedirectURL(originalPath, baseURL = '/login') {
    if (!isValidRedirectURL(originalPath)) {
        return baseURL;
    }
    return `${baseURL}?redirect=${encodeURIComponent(originalPath)}`;
}

/**
 * Extracts and validates the redirect URL from search params
 */
export function getRedirectFromSearchParams(searchParams, defaultURL = '/') {
    const redirect = searchParams?.get?.('redirect');
    return getSafeRedirectURL(redirect, defaultURL);
}
