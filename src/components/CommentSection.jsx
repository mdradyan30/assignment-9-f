'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FiSend,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function CommentSection({ ideaId, onCountChange }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const loadComments = useCallback(async () => {
    try {
      const data = await api.getComments(ideaId);
      setComments(data);
      onCountChange?.(data.length);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [ideaId, onCountChange]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Write something before posting');
      return;
    }
    setSubmitting(true);
    try {
      const { comment } = await api.addComment(ideaId, text.trim());
      setComments((prev) => [comment, ...prev]);
      setText('');
      onCountChange?.(comments.length + 1);
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.message || 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const { comment } = await api.editComment(commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? comment : c))
      );
      cancelEdit();
      toast.success('Comment updated');
    } catch (err) {
      toast.error(err.message || 'Could not update comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCountChange?.(comments.length - 1);
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete comment');
    }
  };

  return (
    <section>
      <header className="flex items-end justify-between border-b border-base-content pb-3 mb-8">
        <h3 className="font-display text-3xl tracking-tightest">
          Discussion
        </h3>
        <span className="num-badge">
          {String(comments.length).padStart(2, '0')} {comments.length === 1 ? 'reply' : 'replies'}
        </span>
      </header>

      {/* Add comment */}
      {user ? (
        <form onSubmit={handleAdd} className="mb-12 pb-12 border-b border-base-300">
          <div className="flex gap-4">
            <Avatar name={user.name} photo={user.photoURL} />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Add to the conversation…"
                className="w-full bg-transparent border-0 border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base resize-none placeholder:italic placeholder:text-base-content/40"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-editorial-solid disabled:opacity-50"
                >
                  {submitting ? 'Posting…' : (
                    <>
                      <FiSend size={13} /> Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="border border-base-300 p-6 text-center mb-12">
          <p className="body-prose text-base">
            <Link href="/login" className="link-editorial">
              Sign in
            </Link>{' '}
            to add your voice to the discussion.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="eyebrow text-base-content/50 py-8 text-center">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="body-prose italic text-center py-8 text-base-content/55">
          No replies yet — be the first to weigh in.
        </p>
      ) : (
        <ul className="space-y-8">
          {comments.map((comment) => {
            const isOwner = user && user.id === comment.userId;
            const isEditing = editingId === comment._id;

            return (
              <li key={comment._id} className="flex gap-4">
                <Avatar name={comment.userName} />
                <div className="flex-1 min-w-0 pb-8 border-b border-base-300 last:border-0">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-medium text-sm truncate">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-base-content/45 shrink-0 font-mono">
                        {timeAgo(comment.createdAt)}
                        {comment.editedAt && ' · edited'}
                      </span>
                    </div>
                    {isOwner && !isEditing && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(comment)}
                          aria-label="Edit comment"
                          className="grid place-items-center h-7 w-7 hover:bg-base-200 text-base-content/55"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          aria-label="Delete comment"
                          className="grid place-items-center h-7 w-7 hover:bg-base-200 text-base-content/55 hover:text-error"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="w-full bg-transparent border-b border-base-300 focus:border-base-content focus:outline-none focus:ring-0 px-0 py-2 text-base resize-none"
                      />
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => handleEdit(comment._id)}
                          className="text-xs link-editorial"
                        >
                          <FiCheck size={12} /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs text-base-content/55 hover:text-base-content"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="body-prose text-base whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Avatar({ name, photo }) {
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        className="h-9 w-9 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <span className="grid place-items-center h-9 w-9 rounded-full bg-base-content text-base-100 text-xs font-medium shrink-0">
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  );
}
