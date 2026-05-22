'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getRedirectFromSearchParams } from '@/lib/redirect-utils';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import Spinner from '@/components/Spinner';

function LoginInner() {
  const { login, user, loading, refreshSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  
  const redirect = getRedirectFromSearchParams(searchParams);
  const error = searchParams?.get?.('error');

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign in — IdeaVault';
  }, []);

  
  useEffect(() => {
    if (error) {
      if (error === 'session_expired') {
        toast.error('Your session expired. Please sign in again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  }, [error]);

 
  useEffect(() => {
    if (!user && !loading) {
      
      refreshSession().catch(err => console.error('Session refresh error:', err));
    }
  }, [loading, user, refreshSession]);

  
  useEffect(() => {
    if (user && !loading) {
      console.log('[Login] User detected, redirecting to:', redirect);
      router.replace(redirect);
    }
  }, [user, loading, router, redirect]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in both fields');
      return;
    }
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome back.');
      
      router.push(redirect);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner fullScreen />
      ) : (
        <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">
          {/* Left editorial panel */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 bg-base-content text-base-100 border-r border-base-content">
            <p className="eyebrow text-base-100/55">№ 01 · The Front Page</p>

            <div>
              <p className="eyebrow text-base-100/55 mb-6">A note to readers</p>
              <h2 className="display text-5xl xl:text-6xl mb-6">
                Welcome <span className="italic">back</span> to the vault.
              </h2>
              <p className="body-prose text-base-100/75 max-w-md">
                Your ideas, your discussions, and the feedback that moves them
                forward — all waiting for you.
              </p>
            </div>

            <p className="text-sm text-base-100/55 italic">
              — The best way to predict the future is to invent it.
            </p>
          </div>

          {/* Right form panel */}
          <div className="flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden mb-10">
                <Link
                  href="/"
                  className="font-display text-2xl tracking-tightest"
                >
                  Idea<span className="italic text-secondary">Vault</span>
                </Link>
              </div>

              <p className="eyebrow text-secondary mb-4">Sign in</p>
              <h1 className="display text-4xl mb-3">Continue reading.</h1>
              <p className="body-prose text-base mb-10">
                Enter your details to access your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

                <div>
                  <label className="eyebrow text-base-content/55 mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 pr-8 text-base placeholder:text-base-content/35"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label="Toggle password visibility"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-base-content/45 hover:text-base-content"
                    >
                      {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      toast('Password reset isn’t available in this demo.', {
                        icon: 'ℹ️',
                      })
                    }
                    className="text-sm text-base-content/55 hover:text-base-content underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-editorial-solid w-full justify-center py-3 disabled:opacity-50"
                >
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-8">
                <span className="h-px flex-1 bg-base-300" />
                <span className="eyebrow text-base-content/45">Or</span>
                <span className="h-px flex-1 bg-base-300" />
              </div>

             
              <GoogleAuthButton
                disabled={submitting}
                redirectURL={redirect}
              />

              <p className="text-center text-sm text-base-content/60 mt-10">
                New to the vault?{' '}
                <Link href="/register" className="link-editorial">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function Field({ label, name, ...props }) {
  return (
    <div>
      <label className="eyebrow text-base-content/55 mb-1.5 block">
        {label}
      </label>
      <input
        name={name}
        {...props}
        className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base placeholder:text-base-content/35"
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <LoginInner />
    </Suspense>
  );
}