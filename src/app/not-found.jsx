'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Simple inline Lottie animation (paper drift) — kept inline to avoid file deps
const paperAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
  nm: 'paper',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'page',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-4], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 45, s: [4], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 90, s: [-4] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 195], h: 0, i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 } },
            { t: 45, s: [200, 205] },
            { t: 90, s: [200, 195] },
          ],
        },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
      },
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [180, 240] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 4 },
        },
        {
          ty: 'st',
          c: { a: 0, k: [0.1, 0.1, 0.1, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 },
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.984, 0.98, 0.969, 1] },
          o: { a: 0, k: 100 },
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Lines on the page
    ...[60, 30, 0, -30, -60].map((yOffset, i) => ({
      ddd: 0,
      ind: i + 2,
      ty: 4,
      nm: `line${i}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: i * 5, s: [0], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 20 + i * 5, s: [100] },
            { t: 70, s: [100], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 90, s: [0] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-4], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 45, s: [4], h: 0, i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
            { t: 90, s: [-4] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 195 + yOffset], h: 0, i: { x: 0.5, y: 1 }, o: { x: 0.5, y: 0 } },
            { t: 45, s: [200, 205 + yOffset] },
            { t: 90, s: [200, 195 + yOffset] },
          ],
        },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
      },
      shapes: [
        {
          ty: 'rc',
          d: 1,
          s: { a: 0, k: [i === 2 ? 80 : 130, 4] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 2 },
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.1, 0.1, 0.1, 1] },
          o: { a: 0, k: 100 },
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    })),
  ],
  markers: [],
};

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = '404 — IdeaVault';
  }, []);

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center">
      <div className="vault-container grid lg:grid-cols-12 gap-10 items-center py-20">
        {/* Left text */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <p className="eyebrow text-secondary mb-6">Error № 404</p>
          <h1 className="display text-6xl md:text-8xl mb-6 leading-none">
            This page <span className="italic">is missing.</span>
          </h1>
          <p className="body-prose text-lg max-w-xl mb-10">
            The address you tried to read isn't on file. Perhaps it was
            archived, perhaps it never existed — or perhaps the URL has a
            typo. Either way, the vault is full of other things worth reading.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="btn-editorial-solid">
              <FiHome size={14} /> Back to the front page
            </Link>
            <Link href="/ideas" className="link-editorial text-sm">
              <FiArrowLeft size={14} /> Browse the archive
            </Link>
          </div>
        </div>

        {/* Right animation */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="aspect-square max-w-sm mx-auto">
            {mounted && (
              <Lottie
                animationData={paperAnimation}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
          <p className="text-center text-xs italic text-base-content/55 mt-3 font-mono">
            Fig. 404 — A page in the wind
          </p>
        </div>
      </div>
    </div>
  );
}
