'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiHeart, FiBookmark } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CommentSection from '@/components/CommentSection';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';

function IdeaDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const loadIdea = useCallback(async () => {
    try {
      const data = await api.getIdea(id);
      setIdea(data);
      setLikesCount(data.likesCount || 0);
      if (user && data.likes) {
        setLiked(data.likes.includes(user.id));
      }
      document.title = `${data.title} — IdeaVault`;
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadIdea();
  }, [loadIdea]);

  useEffect(() => {
    if (!user) return;
    api
      .getBookmarks()
      .then((list) => {
        setBookmarked(list.some((b) => b._id === id));
      })
      .catch(() => {});
  }, [user, id]);

  const handleLike = async () => {
    setLiked((v) => !v);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
    try {
      const res = await api.toggleLike(id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      setLiked((v) => !v);
      setLikesCount((c) => (liked ? c + 1 : c - 1));
      toast.error(err.message || 'Could not update like');
    }
  };

  const handleBookmark = async () => {
    setBookmarked((v) => !v);
    try {
      const res = await api.toggleBookmark(id);
      setBookmarked(res.bookmarked);
      toast.success(res.message);
    } catch (err) {
      setBookmarked((v) => !v);
      toast.error(err.message || 'Could not update bookmark');
    }
  };

  if (loading) return <Spinner fullScreen label="Loading idea" />;

  if (notFound || !idea) {
    return (
      <div className="vault-container py-20">
        <EmptyState
          title="Idea not found."
          message="This page may have been archived, or the link is incorrect."
          actionLabel="Back to the archive"
          actionHref="/ideas"
          eyebrow="A missing entry"
        />
      </div>
    );
  }

  const fallbackImg =
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80';

  const dateLine = new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="vault-container py-12 lg:py-16 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content mb-12 transition-colors"
      >
        <FiArrowLeft size={14} /> Back
      </button>

      {/* Masthead */}
      <header className="mb-10">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-base-300">
          <p className="eyebrow text-secondary">{idea.category}</p>
          <p className="eyebrow text-base-content/55">{dateLine}</p>
        </div>

        <h1 className="display text-4xl sm:text-5xl lg:text-6xl mb-8">
          {idea.title}
        </h1>

        <p className="body-prose text-xl text-base-content/80 italic max-w-2xl">
          {idea.shortDescription}
        </p>

        {/* Byline + actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-6 border-t border-b border-base-300 py-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-base-content text-base-100 text-xs font-medium">
              {idea.authorName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <div>
              <p className="text-sm font-medium leading-tight">
                By {idea.authorName}
              </p>
              <p className="text-xs text-base-content/55 font-mono">
                Filed {dateLine}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border ${
                liked
                  ? 'bg-base-content text-base-100 border-base-content'
                  : 'border-base-300 hover:border-base-content'
              }`}
            >
              <FiHeart
                size={14}
                className={liked ? 'fill-current' : ''}
              />
              <span className="font-mono">{likesCount}</span>
            </button>
            <button
              onClick={handleBookmark}
              aria-label="Bookmark"
              className={`grid place-items-center h-10 w-10 transition-colors border ${
                bookmarked
                  ? 'bg-base-content text-base-100 border-base-content'
                  : 'border-base-300 hover:border-base-content'
              }`}
            >
              <FiBookmark
                size={14}
                className={bookmarked ? 'fill-current' : ''}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Tags */}
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-10">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-base-content/65"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Hero image */}
      <figure className="mb-12">
        <div className="aspect-[16/10] overflow-hidden bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={idea.imageURL || fallbackImg}
            alt={idea.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackImg;
            }}
          />
        </div>
        <figcaption className="mt-3 text-xs italic text-base-content/55 text-center">
          Fig. — Cover art for "{idea.title}"
        </figcaption>
      </figure>

      {/* Detailed description */}
      <section className="mb-16">
        <p className="body-prose text-lg whitespace-pre-wrap dropcap">
          {idea.detailedDescription}
        </p>
      </section>

      {/* Pull quotes / supporting sections */}
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10 mb-16 pt-10 border-t border-base-content">
        {idea.problemStatement && (
          <InfoBlock num="01" title="The problem" text={idea.problemStatement} />
        )}
        {idea.proposedSolution && (
          <InfoBlock num="02" title="The proposal" text={idea.proposedSolution} />
        )}
        {idea.targetAudience && (
          <InfoBlock num="03" title="The audience" text={idea.targetAudience} />
        )}
        {idea.estimatedBudget && (
          <InfoBlock num="04" title="The budget" text={idea.estimatedBudget} />
        )}
      </div>

      <div className="border-t border-base-300 pt-12">
        <CommentSection ideaId={id} />
      </div>
    </article>
  );
}

function InfoBlock({ num, title, text }) {
  return (
    <div>
      <p className="num-badge mb-2">§ {num}</p>
      <h3 className="font-display text-xl tracking-tightest mb-2">{title}</h3>
      <p className="body-prose text-base whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default function IdeaDetailsPage() {
  return (
    <ProtectedRoute>
      <IdeaDetailsContent />
    </ProtectedRoute>
  );
}
