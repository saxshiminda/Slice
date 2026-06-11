import type { CakeCategory } from '@/types';

type FilterOption = CakeCategory | 'All';

const options: FilterOption[] = ['All', 'Wedding', 'Birthday', 'Seasonal', 'Custom'];

interface Props {
  selected: FilterOption;
  onChange: (category: FilterOption) => void;
}

export function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-5 py-2 text-sm font-sans font-medium tracking-wide transition-all duration-200 ${
            selected === option
              ? 'bg-espresso text-warm'
              : 'bg-cream text-espresso/70 hover:bg-espresso/8 hover:text-espresso'
          }`}
          aria-pressed={selected === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
