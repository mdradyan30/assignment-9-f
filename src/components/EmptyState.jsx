'use client';

import Link from 'next/link';

export default function EmptyState({
  title = 'Nothing here yet.',
  message = 'There is no content to display right now.',
  actionLabel,
  actionHref,
  eyebrow = 'A blank page',
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 border border-dashed border-base-300">
      <p className="eyebrow text-base-content/40 mb-6">— {eyebrow} —</p>
      <h3 className="font-display text-3xl tracking-tightest mb-3 max-w-md">
        {title}
      </h3>
      <p className="body-prose max-w-sm mb-8 text-base">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-editorial-solid">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
