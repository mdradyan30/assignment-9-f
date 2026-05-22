'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DebugPage() {
    const [checks, setChecks] = useState({
        env: false,
        apiRoute: false,
        googleConfig: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const runChecks = async () => {
            setLoading(true);

            // Check 1: Environment variables
            const envCheck = {
                NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
                GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            };

            // Check 2: API Route
            let apiCheck = false;
            try {
                const res = await fetch('/api/auth/signin/google', {
                    method: 'OPTIONS',
                });
                apiCheck = res.ok || res.status === 405; // 405 is OK for OPTIONS check
            } catch (err) {
                console.error('API route check failed:', err);
            }

            // Check 3: Google Config
            let googleCheck = false;
            if (envCheck.GOOGLE_CLIENT_ID) {
                googleCheck = true;
            }

            setChecks({
                env: envCheck.NEXT_PUBLIC_APP_URL && envCheck.GOOGLE_CLIENT_ID,
                apiRoute: apiCheck,
                googleConfig: googleCheck,
            });

            setLoading(false);
        };

        runChecks();
    }, []);

    return (
        <div className="min-h-screen bg-base-100 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">🔧 Debug Console</h1>

                <div className="space-y-6">
                    {/* Environment Check */}
                    <div className="card bg-base-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
                        <div className="space-y-2">
                            <p className={`${checks.env ? 'text-success' : 'text-error'}`}>
                                {checks.env ? '✓' : '✗'} Environment variables loaded
                            </p>
                            <div className="text-sm text-base-content/60">
                                <p>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}</p>
                                <p>GOOGLE_CLIENT_ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'}</p>
                            </div>
                        </div>
                    </div>

                    {/* API Route Check */}
                    <div className="card bg-base-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">API Routes</h2>
                        <div className="space-y-2">
                            <p className={`${checks.apiRoute ? 'text-success' : 'text-error'}`}>
                                {checks.apiRoute ? '✓' : '✗'} API auth routes accessible
                            </p>
                            <div className="text-sm text-base-content/60">
                                <p>Route: /api/auth/callback/google</p>
                                <p>Status: {checks.apiRoute ? 'REACHABLE' : 'NOT REACHABLE'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Google Config Check */}
                    <div className="card bg-base-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Google OAuth Config</h2>
                        <div className="space-y-2">
                            <p className={`${checks.googleConfig ? 'text-success' : 'text-error'}`}>
                                {checks.googleConfig ? '✓' : '✗'} Google Client ID configured
                            </p>
                            <div className="text-sm text-base-content/60">
                                <p>Client ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.slice(0, 20)}...</p>
                            </div>
                        </div>
                    </div>

                    {/* Overall Status */}
                    <div className={`card p-6 ${checks.env && checks.apiRoute && checks.googleConfig ? 'bg-success/20' : 'bg-error/20'}`}>
                        <h2 className="text-xl font-semibold mb-2">Overall Status</h2>
                        <p className={checks.env && checks.apiRoute && checks.googleConfig ? 'text-success' : 'text-error'}>
                            {checks.env && checks.apiRoute && checks.googleConfig
                                ? '✓ All systems ready for Google OAuth'
                                : '✗ Some checks failed. Review above.'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                console.log('Current config:', {
                                    appUrl: process.env.NEXT_PUBLIC_APP_URL,
                                    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.slice(0, 20),
                                });
                                toast.success('Check browser console for config');
                            }}
                            className="btn btn-primary w-full"
                        >
                            📋 Log Config to Console
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = '/login';
                            }}
                            className="btn btn-outline w-full"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-12 p-6 bg-base-200 rounded-lg">
                    <h3 className="font-semibold mb-3">📝 Troubleshooting Steps:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Check all items above are green (✓)</li>
                        <li>Verify Google OAuth credentials in .env.local</li>
                        <li>Restart dev server if you just updated .env.local</li>
                        <li>Check browser console (F12) for detailed errors</li>
                        <li>See GOOGLE_OAUTH_TROUBLESHOOTING.md for more help</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
