'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiCheck } from 'react-icons/fi';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function ProfileInner() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', photoURL: '', bio: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Profile — IdeaVault';
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        photoURL: user.photoURL || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile(form);
      await refreshUser();
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="vault-container py-16 lg:py-20">
      <header className="border-b border-base-content pb-6 mb-12">
        <p className="eyebrow text-secondary mb-3">§ Account</p>
        <h1 className="display text-4xl md:text-5xl">
          Your <span className="italic">profile.</span>
        </h1>
        <p className="body-prose text-base mt-4 max-w-2xl">
          Manage how you appear to other readers in the vault.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: identity card */}
        <aside className="lg:col-span-4">
          <div className="border border-base-300 p-6 sticky top-24">
            <p className="num-badge mb-4">№ Identity</p>

            <div className="flex flex-col items-center text-center pb-6 border-b border-base-300">
              {form.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.photoURL}
                  alt={form.name}
                  className="h-24 w-24 rounded-full object-cover mb-4 grayscale"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-base-content text-base-100 grid place-items-center text-3xl font-display mb-4">
                  {form.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <h2 className="font-display text-xl tracking-tightest">
                {form.name || 'Unnamed reader'}
              </h2>
              <p className="text-xs font-mono text-base-content/55 mt-1 break-all">
                {user.email}
              </p>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="eyebrow text-base-content/55">Member since</dt>
                <dd className="font-mono">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="eyebrow text-base-content/55">Method</dt>
                <dd className="font-mono capitalize">
                  {user.provider || 'email'}
                </dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Right: form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 space-y-8"
        >
          <Section num="01" title="Details">
            <Field
              label="Display name"
              name="name"
              value={form.name}
              onChange={handleChange}
              icon={<FiUser size={14} />}
              required
            />
            <Field
              label="Email"
              value={user.email}
              icon={<FiMail size={14} />}
              disabled
              hint="Email cannot be changed"
            />
            <Field
              label="Photo URL"
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              placeholder="https://…/avatar.jpg"
            />
          </Section>

          <Section num="02" title="A short bio">
            <div>
              <label className="eyebrow text-base-content/55 mb-1.5 block">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="A sentence or two about what you're working on."
                className="w-full bg-transparent border border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-3 py-2.5 text-base resize-none placeholder:italic placeholder:text-base-content/35"
                maxLength={280}
              />
              <p className="text-xs font-mono text-base-content/45 mt-1.5 text-right">
                {form.bio.length} / 280
              </p>
            </div>
          </Section>

          <div className="pt-4 border-t border-base-300 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-editorial-solid px-8 py-3 disabled:opacity-50"
            >
              {saving ? (
                'Saving…'
              ) : (
                <>
                  <FiCheck size={14} /> Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <section className="grid md:grid-cols-[120px,1fr] gap-6 pb-8 border-b border-base-300">
      <div>
        <p className="num-badge mb-1">§ {num}</p>
        <h3 className="font-display text-xl tracking-tightest">{title}</h3>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, icon, hint, disabled, ...props }) {
  return (
    <div>
      <label className="eyebrow text-base-content/55 mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-base-content/40">
            {icon}
          </span>
        )}
        <input
          {...props}
          disabled={disabled}
          className={`w-full bg-transparent border-0 border-b focus:outline-none focus:ring-0 py-2 text-base placeholder:text-base-content/35 placeholder:italic ${
            icon ? 'pl-6' : 'pl-0'
          } ${
            disabled
              ? 'border-base-300 text-base-content/55 cursor-not-allowed'
              : 'border-base-300 focus:border-base-content'
          }`}
        />
      </div>
      {hint && (
        <p className="text-xs text-base-content/50 mt-1 italic">{hint}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileInner />
    </ProtectedRoute>
  );
}
