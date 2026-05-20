'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import IdeaForm from '@/components/IdeaForm';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';

function MyIdeasContent() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'My ideas — IdeaVault';
  }, []);

  const loadIdeas = useCallback(async () => {
    try {
      const data = await api.getMyIdeas();
      setIdeas(data);
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const handleUpdate = async (payload) => {
    setBusy(true);
    try {
      const { idea } = await api.updateIdea(editing._id, payload);
      setIdeas((prev) =>
        prev.map((i) => (i._id === idea._id ? idea : i))
      );
      toast.success('Idea updated.');
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Could not update idea');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api.deleteIdea(deleting._id);
      setIdeas((prev) => prev.filter((i) => i._id !== deleting._id));
      toast.success('Idea removed.');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || 'Could not delete idea');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="vault-container py-16 lg:py-20">
      <header className="border-b border-base-content pb-6 mb-12">
        <p className="eyebrow text-secondary mb-3">§ Your workspace</p>
        <h1 className="display text-4xl md:text-5xl">
          The ideas you've <span className="italic">filed.</span>
        </h1>
        <p className="body-prose text-base mt-4 max-w-2xl">
          Manage, edit, or remove the pieces you've submitted to the vault.
        </p>
      </header>

      {loading ? (
        <Spinner label="Loading your archive" />
      ) : ideas.length === 0 ? (
        <EmptyState
          title="You haven't filed anything yet."
          message="Your ideas will appear here once you submit them."
          actionLabel="Submit your first idea"
          actionHref="/add-idea"
          eyebrow="A blank desk"
        />
      ) : (
        <div className="border-t border-base-content">
          {/* Header row (desktop) */}
          <div className="hidden md:grid grid-cols-[1fr,140px,120px,140px] gap-6 py-3 border-b border-base-300">
            <span className="eyebrow text-base-content/55">Title</span>
            <span className="eyebrow text-base-content/55">Category</span>
            <span className="eyebrow text-base-content/55">Engagement</span>
            <span className="eyebrow text-base-content/55 text-right">Actions</span>
          </div>

          <ul>
            {ideas.map((idea, i) => (
              <li
                key={idea._id}
                className="grid md:grid-cols-[1fr,140px,120px,140px] gap-6 py-5 border-b border-base-300 items-center"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span className="num-badge mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="font-display text-lg tracking-tightest hover:italic transition-all line-clamp-1"
                    >
                      {idea.title}
                    </Link>
                    <p className="text-sm text-base-content/60 line-clamp-1 mt-0.5">
                      {idea.shortDescription}
                    </p>
                  </div>
                </div>

                <span className="text-sm italic text-secondary">
                  {idea.category}
                </span>

                <div className="flex items-center gap-3 text-xs text-base-content/55 font-mono">
                  <span className="flex items-center gap-1">
                    <FiHeart size={12} /> {idea.likesCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageCircle size={12} /> {idea.commentsCount || 0}
                  </span>
                </div>

                <div className="flex gap-1 md:justify-end">
                  <Link
                    href={`/ideas/${idea._id}`}
                    aria-label="View"
                    className="grid place-items-center h-8 w-8 border border-base-300 hover:bg-base-200 text-base-content/65"
                  >
                    <FiEye size={13} />
                  </Link>
                  <button
                    onClick={() => setEditing(idea)}
                    aria-label="Edit"
                    className="grid place-items-center h-8 w-8 border border-base-300 hover:bg-base-content hover:text-base-100 hover:border-base-content text-base-content/65"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleting(idea)}
                    aria-label="Delete"
                    className="grid place-items-center h-8 w-8 border border-base-300 hover:bg-error hover:text-error-content hover:border-error text-base-content/65"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit idea" onClose={() => setEditing(null)}>
          <IdeaForm
            initialValues={editing}
            onSubmit={handleUpdate}
            submitting={busy}
            submitLabel="Save changes"
          />
        </Modal>
      )}

      {/* Delete confirm modal */}
      {deleting && (
        <Modal
          title="Delete idea?"
          onClose={() => !busy && setDeleting(null)}
          small
        >
          <p className="body-prose text-base mb-2">
            Are you sure you want to delete{' '}
            <span className="italic">"{deleting.title}"</span>?
          </p>
          <p className="text-sm text-base-content/55 mb-8">
            This will also remove all its comments. This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleting(null)}
              disabled={busy}
              className="px-5 py-2.5 text-sm border border-base-300 hover:bg-base-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="px-5 py-2.5 text-sm bg-error text-error-content hover:opacity-90 disabled:opacity-50"
            >
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, small }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-base-content/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${
          small ? 'max-w-md' : 'max-w-3xl'
        } max-h-[90vh] overflow-y-auto bg-base-100 border border-base-300 animate-fade-in`}
      >
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-base-300 bg-base-100 z-10">
          <h2 className="font-display text-xl tracking-tightest">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid place-items-center h-9 w-9 hover:bg-base-200 text-base-content/65"
          >
            <FiX size={16} />
          </button>
        </div>
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}

export default function MyIdeasPage() {
  return (
    <ProtectedRoute>
      <MyIdeasContent />
    </ProtectedRoute>
  );
}
