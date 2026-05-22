'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import { api } from '@/lib/api';
import Spinner from '@/components/Spinner';

export default function TopContributorsSection() {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

       
        api
            .getIdeas('?limit=100')
            .then((data) => {
                if (active) {
                    const ideasList = Array.isArray(data) ? data : data.ideas || [];

                    
                    const authorMap = {};
                    ideasList.forEach((idea) => {
                        const authorId = idea.authorId || idea.authorName;
                        if (authorId) {
                            if (!authorMap[authorId]) {
                                authorMap[authorId] = {
                                    id: authorId,
                                    name: idea.authorName || 'Anonymous',
                                    photoURL: idea.authorPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                                    count: 0,
                                };
                            }
                            authorMap[authorId].count += 1;
                        }
                    });

                    
                    const topContributors = Object.values(authorMap)
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 6);

                    setContributors(topContributors);
                }
            })
            .catch(() => {
                if (active) setContributors([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <section className="border-t border-base-300">
            <div className="vault-container py-16 lg:py-20">
                <div className="flex items-end justify-between border-b border-base-content pb-4 mb-10">
                    <div>
                        <p className="eyebrow text-secondary mb-2">§ Community leaders</p>
                        <h2 className="display text-3xl md:text-4xl">
                            Top contributors.
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <Spinner label="Loading contributors" />
                ) : contributors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-base-content/60">
                            No contributors yet. Be the first to share an idea!
                        </p>
                        <Link href="/add-idea" className="link-editorial mt-4 inline-flex">
                            Add your idea <FiArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contributors.map((contributor) => (
                            <div
                                key={contributor.id}
                                className="group p-6 bg-gradient-to-br from-base-100 to-base-50 border border-base-300 rounded-lg hover:border-secondary hover:shadow-md transition-all text-center"
                            >
                                {/* Avatar */}
                                <div className="mb-4 flex justify-center">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-base-300 border-2 border-base-300 group-hover:border-secondary transition-all">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={contributor.photoURL}
                                            alt={contributor.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="font-display text-lg tracking-tightest mb-1 line-clamp-1">
                                    {contributor.name}
                                </h3>

                                {/* Ideas count */}
                                <div className="flex items-center justify-center gap-1 text-sm text-base-content/60 mb-4">
                                    <FiMessageSquare size={14} />
                                    <span>{contributor.count} idea{contributor.count !== 1 ? 's' : ''}</span>
                                </div>

                                {/* View profile link */}
                                <Link
                                    href={`/profile/${contributor.id}`}
                                    className="inline-block text-sm link-editorial"
                                >
                                    View profile
                                    <FiArrowRight size={12} className="inline ml-1" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
