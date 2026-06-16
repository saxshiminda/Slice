import { CategoryFilter } from './category-filter';
import type { CakeCategory } from '@/types';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

type FilterOption = CakeCategory | 'All';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  selectedCategory: FilterOption;
  onCategoryChange: (category: FilterOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function MenuToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="menu-search" className="sr-only">
            Search cakes
          </label>
          <input
            id="menu-search"
            type="search"
            placeholder="Search cakes…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors"
          />
        </div>
        <div className="sm:w-52">
          <label htmlFor="sort-select" className="sr-only">
            Sort cakes
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso focus:outline-none focus:border-rose transition-colors"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CategoryFilter selected={selectedCategory} onChange={onCategoryChange} />
    </div>
  );
}
