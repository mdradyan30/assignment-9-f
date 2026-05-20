'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import Spinner from '@/components/Spinner';

const RULES = [
  { id: 'len', label: 'At least 6 characters', test: (v) => v.length >= 6 },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
];

function RegisterInner() {
  const { register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Subscribe — IdeaVault';
  }, []);

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const passwordValid = RULES.every((r) => r.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email and password are required');
      return;
    }
    if (!passwordValid) {
      toast.error('Password does not meet all the requirements');
      return;
    }

    setSubmitting(true);
    try {
      console.log('[Register] Submitting form:', { name: form.name, email: form.email });
      await register(form);
      toast.success('Welcome to the vault.');
      router.push(redirect);
    } catch (err) {
      console.error('[Register] Error:', err);
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] grid lg:grid-cols-2">
      {/* Left editorial panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-base-content text-base-100 border-r border-base-content">
        <p className="eyebrow text-base-100/55">№ 02 · Subscriptions</p>

        <div>
          <p className="eyebrow text-base-100/55 mb-6">A standing invitation</p>
          <h2 className="display text-5xl xl:text-6xl mb-6">
            Every important company began as <span className="italic">one paragraph.</span>
          </h2>
          <p className="body-prose text-base-100/75 max-w-md">
            Join the readers and writers who are working out, in public, what
            the next thing might be.
          </p>
        </div>

        <div className="flex gap-12 pt-8 border-t border-base-100/20">
          <div>
            <p className="font-display text-3xl tracking-tightest">12,400+</p>
            <p className="eyebrow text-base-100/55 mt-1">Ideas</p>
          </div>
          <div>
            <p className="font-display text-3xl tracking-tightest">40,000+</p>
            <p className="eyebrow text-base-100/55 mt-1">Discussions</p>
          </div>
        </div>
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

          <p className="eyebrow text-secondary mb-4">Subscribe</p>
          <h1 className="display text-4xl mb-3">Create an account.</h1>
          <p className="body-prose text-base mb-10">
            Start submitting and discussing ideas in under a minute.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Field
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Founder"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <Field
              label="Photo URL"
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              placeholder="https://…/avatar.jpg (optional)"
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

              {form.password.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {RULES.map((rule) => {
                    const ok = rule.test(form.password);
                    return (
                      <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-xs font-mono ${ok ? 'text-success' : 'text-base-content/50'
                          }`}
                      >
                        {ok ? <FiCheck size={13} /> : <FiX size={13} />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-editorial-solid w-full justify-center py-3 disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-8">
            <span className="h-px flex-1 bg-base-300" />
            <span className="eyebrow text-base-content/45">Or</span>
            <span className="h-px flex-1 bg-base-300" />
          </div>

          <GoogleAuthButton
            disabled={submitting}
            onSuccess={() => router.push(redirect)}
          />

          <p className="text-center text-sm text-base-content/60 mt-10">
            Already subscribed?{' '}
            <Link href="/login" className="link-editorial">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="eyebrow text-base-content/55 mb-1.5 block">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base placeholder:text-base-content/35"
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <RegisterInner />
    </Suspense>
  );
}
