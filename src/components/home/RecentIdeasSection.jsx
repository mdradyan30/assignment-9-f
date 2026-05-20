'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { api } from '@/lib/api';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';

export default function RecentIdeasSection() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        api
            .getRecent(6)
            .then((data) => {
                if (active) setIdeas(Array.isArray(data) ? data : data.ideas || []);
            })
            .catch(() => {
                if (active) setIdeas([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <section className="border-t border-base-300 bg-base-50">
            <div className="vault-container py-16 lg:py-20">
                <div className="flex items-end justify-between border-b border-base-content pb-4 mb-10">
                    <div>
                        <p className="eyebrow text-secondary mb-2">§ Fresh submissions</p>
                        <h2 className="display text-3xl md:text-4xl">Recently added.</h2>
                    </div>
                    <Link href="/ideas?sort=-createdAt" className="link-editorial text-sm hidden sm:inline-flex">
                        All recent <FiArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <Spinner label="Loading recent ideas" />
                ) : ideas.length === 0 ? (
                    <EmptyState
                        title="No recent ideas yet."
                        message="Check back soon for the latest submissions."
                        eyebrow="Coming soon"
                    />
                ) : (
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                            <Link
                                key={idea._id}
                                href={`/ideas/${idea._id}`}
                                className="group flex items-start justify-between p-5 bg-base-100 border border-base-300 rounded-lg hover:bg-base-200 hover:border-base-content transition-all"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-display text-lg leading-tight tracking-tightest line-clamp-2 group-hover:italic transition-all mb-2">
                                        {idea.title}
                                    </h3>
                                    <p className="text-sm text-base-content/60 line-clamp-1">
                                        {idea.shortDescription}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 ml-4 whitespace-nowrap text-xs text-base-content/55">
                                    <span className="flex items-center gap-1">
                                        <FiUser size={14} />
                                        {idea.authorName || 'Anonymous'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiClock size={14} />
                                        {formatDate(idea.createdAt)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
