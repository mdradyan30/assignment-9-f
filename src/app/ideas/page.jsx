'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CATEGORY_FILTER } from '@/lib/constants';
import Spinner from '@/components/Spinner';
import EmptyState from '@/components/EmptyState';

function IdeasInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    document.title = 'Browse Ideas — IdeaVault';
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (category && category !== 'All Categories') params.set('category', category);
      params.set('sort', sortBy);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await api.getIdeas(qs);
      setIdeas(data);
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sortBy]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setSortBy('newest');
  };

  const hasActiveFilters =
    search || category !== 'All Categories' || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-base-100">
      <div className="vault-container py-12 lg:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Browse Ideas</h1>
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-8">
          <div className="flex gap-3 mb-6">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <FiSearch size={20} className="absolute left-4 text-base-content/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Ideas..."
                className="w-full pl-12 pr-10 py-3 border-2 border-base-300 rounded-lg focus:outline-none focus:border-primary bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 text-base-content/50 hover:text-base-content"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border-2 border-base-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="All Categories">All Categories</option>
              {CATEGORY_FILTER.filter((cat) => cat !== 'All' && cat !== 'All Categories').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-base-300 rounded-lg focus:outline-none focus:border-primary bg-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Liked</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-focus underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        {loading ? (
          <Spinner label="Loading ideas..." />
        ) : ideas.length === 0 ? (
          <EmptyState
            title="No ideas found"
            message="Try adjusting your search or filters"
            actionLabel="Submit an idea"
            actionHref="/add-idea"
            eyebrow="Empty results"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div key={idea._id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                <Link href={`/ideas/${idea._id}`} className="block aspect-[4/3] overflow-hidden bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={idea.imageURL || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80'}
                    alt={idea.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80';
                    }}
                  />
                </Link>

                {/* Content */}
                <div className="p-5">
                  {/* Category Tag */}
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded mb-3">
                    {idea.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    <Link href={`/ideas/${idea._id}`}>{idea.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-base-content/60 mb-4 line-clamp-2">
                    {idea.shortDescription || idea.description}
                  </p>

                  {/* Likes */}
                  <div className="mb-4 text-sm text-base-content/50">
                    ♥ {idea.likesCount || 0} likes
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/ideas/${idea._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <IdeasInner />
    </Suspense>
  );
}
