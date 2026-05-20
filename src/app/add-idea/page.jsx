'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import IdeaForm from '@/components/IdeaForm';

function AddIdeaContent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Submit an idea — IdeaVault';
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const { idea } = await api.createIdea(payload);
      toast.success('Idea filed.');
      router.push(`/ideas/${idea._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not submit idea');
      setSubmitting(false);
    }
  };

  return (
    <div className="vault-container py-16 lg:py-20 max-w-3xl">
      <header className="border-b border-base-content pb-6 mb-12">
        <p className="eyebrow text-secondary mb-3">§ Submissions</p>
        <h1 className="display text-4xl md:text-5xl">
          File a <span className="italic">new idea.</span>
        </h1>
        <p className="body-prose text-base mt-4 max-w-xl">
          Fill in the details below. The more context you give, the better
          the conversation that follows.
        </p>
      </header>

      <IdeaForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Submit to the vault"
      />
    </div>
  );
}

export default function AddIdeaPage() {
  return (
    <ProtectedRoute>
      <AddIdeaContent />
    </ProtectedRoute>
  );
}
