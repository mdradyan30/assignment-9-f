'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function CtaBand() {
  return (
    <section className="border-t border-base-300 bg-base-content text-base-100">
      <div className="vault-container py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-base-100/55 mb-5">§ A closing word</p>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl">
              Got an idea that <span className="italic">won't leave you alone?</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="body-prose text-base mb-8 text-base-100/75">
              Stop letting it gather dust in a notes app. Submit it to the
              vault, and let other readers help you find out if it's the one.
            </p>
            <Link
              href="/add-idea"
              className="inline-flex items-center gap-2 py-3 px-5 bg-base-100 text-base-content text-sm font-medium hover:bg-base-200 transition-colors"
            >
              Submit an idea <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
