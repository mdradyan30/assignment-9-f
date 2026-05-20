'use client';

export default function Spinner({ label = 'Loading', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border border-base-300" />
        <div className="absolute inset-0 rounded-full border border-transparent border-t-base-content animate-spin" />
      </div>
      <p className="eyebrow text-base-content/55">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-24">{content}</div>
  );
}
