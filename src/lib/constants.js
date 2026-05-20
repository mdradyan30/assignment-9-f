export const CATEGORIES = [
  'Tech',
  'Health',
  'AI',
  'Education',
  'Finance',
  'Sustainability',
  'E-commerce',
  'Social Impact',
];

export const CATEGORY_FILTER = ['All', ...CATEGORIES];

// Accent color per category — keeps cards visually varied but consistent
export const CATEGORY_STYLE = {
  Tech: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
  Health: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  AI: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
  Education: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  Finance: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
  Sustainability: 'bg-lime-500/10 text-lime-600 border-lime-500/30',
  'E-commerce': 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  'Social Impact': 'bg-orange-500/10 text-orange-600 border-orange-500/30',
};

export function categoryStyle(cat) {
  return (
    CATEGORY_STYLE[cat] ||
    'bg-base-300 text-base-content/70 border-base-content/20'
  );
}
