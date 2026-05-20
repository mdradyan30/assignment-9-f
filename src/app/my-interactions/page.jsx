'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiMessageCircle } from 'react-icons/fi';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';

function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function MyInteractionsInner() {
  const [data, setData] = useState({ comments: [], commentedIdeas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Your activity — IdeaVault';
    let active = true;
    api
      .getMyInteractions()
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setData({ comments: [], commentedIdeas: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const { comments, commentedIdeas } = data;

  // Group comments by idea
  const ideaMap = new Map();
  commentedIdeas.forEach((idea) => ideaMap.set(String(idea._id), idea));

  const grouped = {};
  comments.forEach((c) => {
    const key = String(c.ideaId);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  return (
    <div className="vault-container py-16 lg:py-20">
      <header className="border-b border-base-content pb-6 mb-12">
        <p className="eyebrow text-secondary mb-3">§ Your archive</p>
        <h1 className="display text-4xl md:text-5xl">
          The ideas you've <span className="italic">weighed in on.</span>
        </h1>
        <p className="body-prose text-base mt-4 max-w-2xl">
          Every conversation you've joined, kept in one place. The threads
          you've shaped — and the ones still waiting for your reply.
        </p>
      </header>

      {loading ? (
        <Spinner label="Gathering your activity" />
      ) : Object.keys(grouped).length === 0 ? (
        <EmptyState
          title="No replies yet."
          message="Once you comment on an idea, your activity will appear here."
          actionLabel="Browse ideas"
          actionHref="/ideas"
          eyebrow="A quiet log"
        />
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([ideaId, list]) => {
            const idea = ideaMap.get(ideaId);
            return (
              <section
                key={ideaId}
                className="grid lg:grid-cols-12 gap-8 pb-12 border-b border-base-300 last:border-0"
              >
                {/* Left: idea card */}
                <div className="lg:col-span-5">
                  {idea ? (
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="group block"
                    >
                      <p className="eyebrow text-secondary mb-2">
                        {idea.category}
                      </p>
                      <h2 className="font-display text-2xl tracking-tightest leading-tight mb-3 group-hover:italic transition-all">
                        {idea.title}
                      </h2>
                      <p className="text-sm text-base-content/65 line-clamp-2 mb-4">
                        {idea.shortDescription}
                      </p>
                      <span className="link-editorial text-sm">
                        Open the thread <FiArrowUpRight size={14} />
                      </span>
                    </Link>
                  ) : (
                    <div className="text-sm italic text-base-content/55">
                      This idea is no longer available.
                    </div>
                  )}
                </div>

                {/* Right: your comments */}
                <div className="lg:col-span-7 lg:border-l lg:border-base-300 lg:pl-8">
                  <p className="eyebrow text-base-content/55 mb-5 flex items-center gap-2">
                    <FiMessageCircle size={12} />
                    Your replies ({list.length})
                  </p>
                  <ul className="space-y-5">
                    {list.map((c) => (
                      <li
                        key={c._id}
                        className="pb-5 border-b border-base-300 last:border-0"
                      >
                        <p className="body-prose text-base whitespace-pre-wrap break-words">
                          {c.text}
                        </p>
                        <p className="text-xs text-base-content/45 font-mono mt-2">
                          {timeAgo(c.createdAt)}
                          {c.editedAt && ' · edited'}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyInteractionsPage() {
  return (
    <ProtectedRoute>
      <MyInteractionsInner />
    </ProtectedRoute>
  );
}
