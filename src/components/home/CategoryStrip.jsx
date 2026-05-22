'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

export default function CategoryStrip() {
  const loop = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  return (
    <section className="border-y border-base-300 overflow-hidden bg-base-200">
      <div className="vault-container pt-16 pb-10 text-center">
        <p className="eyebrow text-secondary mb-4">§ The eight fields</p>
        <h2 className="display text-3xl md:text-4xl max-w-xl mx-auto">
          What we cover, <span className="italic">briefly.</span>
        </h2>
      </div>


      <div className="relative py-8 border-t border-base-300">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-base-200 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-base-200 to-transparent z-10 pointer-events-none" />

        <div className="marquee gap-12 px-8">
          {loop.map((cat, i) => (
            <Link
              key={`${cat}-${i}`}
              href={`/ideas?category=${encodeURIComponent(cat)}`}
              className="group flex items-baseline gap-3 shrink-0 whitespace-nowrap"
            >
              <span className="num-badge text-base-content/40">
                {String((i % CATEGORIES.length) + 1).padStart(2, '0')}
              </span>
              <span className="font-display text-3xl md:text-4xl tracking-tightest group-hover:italic transition-all">
                {cat}
              </span>
              <span className="text-base-content/30 mx-4">·</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
