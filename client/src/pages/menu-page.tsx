import { useMemo, useState } from 'react';
import {
  useCakes,
  useCategories,
  CakeCard,
  CakeCardSkeleton,
  MenuToolbar,
  filterAndSortCakes,
  type SortOption,
} from '@/features/menu';
import { useT } from '@/i18n';

const SKELETON_COUNT = 6;

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const t = useT();

  const { data: categories = [] } = useCategories();
  const { data, isLoading, isError } = useCakes({
    category: selectedCategory,
  });

  const displayedCakes = useMemo(
    () => (data ? filterAndSortCakes(data.cakes, search, sort) : []),
    [data, search, sort]
  );

  const categoryLabel =
    selectedCategory === 'all'
      ? ''
      : (categories.find((c) => c.slug === selectedCategory)?.name ?? '');

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-6xl mx-auto">
        <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
          {t.menu.ourCakes}
        </p>
        <h1 className="font-display text-5xl lg:text-6xl text-espresso mb-4">{t.menu.heading}</h1>
        <p className="font-sans text-base text-espresso/60 max-w-lg leading-relaxed">
          {t.menu.tagline}
        </p>
      </section>

      <section className="sticky top-16 lg:top-20 z-10 bg-warm/95 backdrop-blur-sm border-b border-espresso/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <MenuToolbar
            categories={categories}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <CakeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-24">
            <p className="font-sans text-espresso/50 text-sm">{t.menu.loadError}</p>
          </div>
        )}

        {data && displayedCakes.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-espresso/40 mb-2">{t.menu.nothingHere}</p>
            <p className="font-sans text-sm text-espresso/40">
              {search ? t.menu.noResults : t.menu.noCategory}
            </p>
          </div>
        )}

        {data && displayedCakes.length > 0 && (
          <>
            <p className="font-sans text-xs text-espresso/40 mb-8">
              {displayedCakes.length} {t.menu.of} {data.total}{' '}
              {data.total === 1 ? t.menu.showing : t.menu.showingPlural}
              {categoryLabel ? ` ${t.menu.in} ${categoryLabel}` : ''}
              {search ? ` ${t.menu.matching} "${search}"` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {displayedCakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
