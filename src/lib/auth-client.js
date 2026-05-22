'use client';

import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";


const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
    baseURL: baseURL,
    basePath: "/api/auth",
    plugins: [
        jwtClient()
    ]
});

/**
 * Sign up with email and password
 */
export async function signUp(email, password, name) {
    try {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            image: undefined,
        });

        if (error) throw new Error(error.message);

        return {
            success: true,
            user: data?.user,
            session: data?.session,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Sign up failed",
        };
    }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
    try {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) throw new Error(error.message);

        return {
            success: true,
            user: data?.user,
            session: data?.session,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Sign in failed",
        };
    }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(redirectURL = "/") {
    try {
        const result = await authClient.signIn.social({
            provider: "google",
            callbackURL: redirectURL, // dynamic redirect
        });
        return result;
    } catch (error) {
        console.error("Google sign in error:", error);
        throw error;
    }
}

/**
 * Get the current session (For one-time imperative checks)
 */
export async function getSession() {
    try {
        const { data } = await authClient.getSession();
        // Return both session and user data
        return {
            session: data?.session || null,
            user: data?.user || null,
        };
    } catch (error) {
        console.error("Failed to get session:", error);
        return {
            session: null,
            user: null,
        };
    }
}

/**
 * Get the current user
 */
export async function getUser() {
    try {
        const { data } = await authClient.getSession();
        return data?.user || null;
    } catch (error) {
        console.error("Failed to get user:", error);
        return null;
    }
}

/**
 * Sign out the current user
 */
export async function signOut() {
    try {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/login";
                },
            },
        });
    } catch (error) {
        console.error("Sign out error:", error);
        throw error;
    }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates) {
    try {
        // updates অবজেক্টটি প্রোপার্টি আকারে পাস করা হলো
        const { data, error } = await authClient.updateUser({
            ...updates
        });

        if (error) throw new Error(error.message);
        return { success: true, user: data };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Update failed",
        };
    }
}

/**
 * Change password (Using official Better-Auth client method)
 */
export async function changePassword(oldPassword, newPassword) {
    try {
        const { error } = await authClient.changePassword({
            newPassword: newPassword,
            currentPassword: oldPassword, // Better-Auth এ প্রপার্টির নাম 'currentPassword'
        });

        if (error) throw new Error(error.message);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Change password failed",
        };
    }
}

/**
 * Use session in client components (Better-Auth official Hook)
 */
export function useSession() {
    const { data, isPending, error } = authClient.useSession();

    return {
        session: data?.session || null,
        user: data?.user || null,
        loading: isPending,
        error
    };
}