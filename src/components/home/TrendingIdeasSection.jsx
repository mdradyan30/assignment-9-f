'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { api } from '@/lib/api';
import IdeaCard from '@/components/IdeaCard';
import Spinner from '@/components/Spinner';

export default function TrendingIdeasSection() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingIdeas = async () => {
      try {
        const data = await api.getTrending(6);
        
        const ideasArray = Array.isArray(data) ? data : data.ideas || [];
        setIdeas(ideasArray);
      } catch (error) {
        console.error('Failed to fetch trending ideas:', error);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingIdeas();
  }, []);

  return (
    <section className="border-t border-base-300">
      <div className="vault-container py-20 lg:py-24">
        <div className="flex items-end justify-between border-b border-base-content pb-4 mb-12">
          <div>
            <p className="eyebrow text-secondary mb-2">§ This week's reading</p>
            <h2 className="display text-4xl md:text-5xl">
              Trending in the vault.
            </h2>
          </div>
          <Link href="/ideas" className="link-editorial text-sm hidden sm:inline-flex">
            All ideas <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12">
            <Spinner label="Loading trending ideas" />
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 stagger">
            {ideas.map((idea, i) => (
              <IdeaCard key={idea._id} idea={idea} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-base-content/60">No trending ideas at the moment.</p>
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/ideas" className="link-editorial text-sm">
            Read all ideas <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
