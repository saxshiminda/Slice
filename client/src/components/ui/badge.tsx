import type { CakeCategory } from '@/types';

interface Props {
  category: CakeCategory;
}

const categoryStyles: Record<CakeCategory, string> = {
  Wedding: 'bg-rose/10 text-rose-dark',
  Birthday: 'bg-sage/15 text-sage',
  Seasonal: 'bg-espresso/8 text-espresso/70',
  Custom: 'bg-cream text-espresso/60 border border-espresso/15',
};

export function Badge({ category }: Props) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-sans font-medium tracking-wide uppercase ${categoryStyles[category]}`}
    >
      {category}
    </span>
  );
}
