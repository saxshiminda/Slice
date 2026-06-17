import type { Category } from '@/types';
import { useT } from '@/i18n';

interface Props {
  categories: Category[];
  selected: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onChange }: Props) {
  const t = useT();
  const options = [{ slug: 'all', name: t.menu.all }, ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {options.map((option) => (
        <button
          key={option.slug}
          onClick={() => onChange(option.slug)}
          className={`px-5 py-2 text-sm font-sans font-medium tracking-wide transition-all duration-200 ${
            selected === option.slug
              ? 'bg-espresso text-warm'
              : 'bg-cream text-espresso/70 hover:bg-espresso/8 hover:text-espresso'
          }`}
          aria-pressed={selected === option.slug}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
