'use client';

import Link from 'next/link';
import { FiHeart, FiMessageCircle, FiArrowUpRight } from 'react-icons/fi';

export default function IdeaCard({ idea, index = 0 }) {
  const fallbackImg =
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80';

  const issueNum = String((index % 99) + 1).padStart(2, '0');

  return (
    <article
      className="idea-card group p-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <Link
        href={`/ideas/${idea._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-base-200"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={idea.imageURL || fallbackImg}
          alt={idea.title}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
          }}
        />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        
        <div className="flex items-center justify-between mb-3">
          <span className="num-badge">№ {issueNum}</span>
          <span className="eyebrow text-secondary">{idea.category}</span>
        </div>

        <h3 className="font-display text-xl leading-tight tracking-tightest line-clamp-2 mb-3">
          <Link
            href={`/ideas/${idea._id}`}
            className="hover:italic transition-all"
          >
            {idea.title}
          </Link>
        </h3>

        <p className="text-[15px] text-base-content/70 leading-relaxed line-clamp-3 mb-5">
          {idea.shortDescription}
        </p>

        {/* Meta row */}
        <div className="mt-auto pt-4 border-t border-base-300 flex items-center justify-between text-xs">
          <span className="text-base-content/60">
            By{' '}
            <span className="text-base-content font-medium">
              {idea.authorName || 'Anonymous'}
            </span>
          </span>
          <div className="flex items-center gap-3 text-base-content/55 font-mono">
            <span className="flex items-center gap-1">
              <FiHeart size={12} /> {idea.likesCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageCircle size={12} /> {idea.commentsCount || 0}
            </span>
          </div>
        </div>

        <Link
          href={`/ideas/${idea._id}`}
          className="mt-4 link-editorial text-sm w-full block text-center py-2 px-3 rounded hover:bg-base-200 transition-colors"
        >
          Read the full idea
          <FiArrowUpRight size={14} className="inline ml-2" />
        </Link>
      </div>
    </article>
  );
}
