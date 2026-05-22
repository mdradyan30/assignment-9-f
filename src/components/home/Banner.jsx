'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SLIDES = [
  {
    kicker: 'Issue 01 · The Premise',
    title: 'A reading room',
    italic: 'for loud ideas.',
    lede: 'Post your concept. Read what others are working on. Discuss in long form. Find out if your idea has legs — before you write a single line of code.',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80',
    caption: 'On thinking out loud',
  },
  {
    kicker: 'Issue 02 · The Conversation',
    title: 'Your next collaborator',
    italic: 'is one comment away.',
    lede: 'Every idea here begins a thread. Comment, refine, and meet the people who think in possibilities — not in elevator pitches.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80',
    caption: 'On honest feedback',
  },
  {
    kicker: 'Issue 03 · The Field',
    title: 'Notes from the front',
    italic: 'of what comes next.',
    lede: 'From AI tooling to climate work — read what founders are sketching in eight fields. The good ideas are still uncomfortable.',
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80',
    caption: 'On the new and the strange',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 7500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="border-b border-base-300">
      {/* Masthead bar */}
      <div className="border-b border-base-300">
        <div className="vault-container py-3 flex items-center justify-between text-xs">
          <span className="eyebrow text-base-content/55">
            IdeaVault · A weekly journal of unfinished ideas
          </span>
          <span className="eyebrow text-base-content/55 hidden md:inline">
            Vol. 01 · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Hero section with full-width image background */}
      <div className="relative w-full min-h-[600px] lg:min-h-[600px] overflow-hidden bg-base-200 mx-auto">
        {/* Full-width image */}
        {SLIDES.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s.image}
            alt={s.italic}
            className={`absolute inset-0 h-full w-full object-cover  grayscale transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ))}

        {/* Content overlay */}
        <div className="relative z-10 vault-container py-16 lg:py-24 flex flex-col justify-between h-full">
          {/* Text content on the left */}
          <div key={current} className="lg:col-span-7 animate-fade-up max-w-2xl">
            <p className="eyebrow text-secondary mb-6">{slide.kicker}</p>
            <h1 className="display text-5xl sm:text-6xl lg:text-7xl mb-6 text-white">
              {slide.title}{' '}
              <span className="italic font-light text-orange-900">
                {slide.italic}
              </span>
            </h1>
            <p className="body-prose text-lg max-w-xl mb-10 dropcap text-amber-900">
              {slide.lede}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/ideas" className="btn-editorial-solid bg-blue-500 hover:bg-blue-800 rounded-full">
                Begin reading <FiArrowRight size={14} />
              </Link>
              <Link href="/add-idea" className="btn-editorial text-sm text-white bg-orange-500 hover:bg-blue-600 px-4 py-2 rounded-full">
                Submit an idea
              </Link>  
            </div>
          </div>

          {/* Slide controls and caption at the bottom */}
          <div className="mt-20">
            {/* Figcaption */}
            <div className="flex items-center justify-between mb-6 text-xs">
              <span className="eyebrow text-base-100/55">
                Fig. {String(current + 1).padStart(2, '0')}
              </span>
              <span className="italic text-base-100/65">
                — {slide.caption}
              </span>
            </div>

            {/* Slide controls */}
            <div className="flex items-center justify-between pt-4 border-t border-base-100/25">
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-px transition-all ${i === current ? 'w-10 bg-base-100' : 'w-6 bg-base-100/25 mt-px'
                      }`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="grid place-items-center h-8 w-8 hover:bg-base-100/10 text-base-100"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="grid place-items-center h-8 w-8 hover:bg-base-100/10 text-base-100"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="vault-container py-8 border-t border-base-300 grid grid-cols-3 gap-6">
        <Stat num="12,400+" label="Ideas in the vault" />
        <Stat num="08" label="Categories of work" />
        <Stat num="40,000+" label="Discussions running" />
      </div>
    </section>
  );
}

function Stat({ num, label }) {
  return (
    <div>
      <p className="font-display text-3xl md:text-4xl tracking-tightest">
        {num}
      </p>
      <p className="eyebrow text-base-content/55 mt-1">{label}</p>
    </div>
  );
}
