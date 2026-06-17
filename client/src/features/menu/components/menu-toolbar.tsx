import { CategoryFilter } from './category-filter';
import type { Category } from '@/types';
import { useT } from '@/i18n';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

interface Props {
  categories: Category[];
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}

export function MenuToolbar({
  categories,
  search,
  onSearchChange,
  sort,
  onSortChange,
  selectedCategory,
  onCategoryChange,
}: Props) {
  const t = useT();

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: t.menu.sort.default },
    { value: 'name', label: t.menu.sort.nameAz },
    { value: 'price-asc', label: t.menu.sort.priceLow },
    { value: 'price-desc', label: t.menu.sort.priceHigh },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="menu-search" className="sr-only">
            {t.menu.search}
          </label>
          <input
            id="menu-search"
            type="search"
            placeholder={t.menu.search}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors"
          />
        </div>
        <div className="sm:w-52">
          <label htmlFor="sort-select" className="sr-only">
            {t.menu.sortLabel}
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

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={onCategoryChange}
      />
    </div>
  );
}
