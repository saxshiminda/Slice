import { useMemo, useState } from 'react';
import {
  useCakes,
  CakeCard,
  CakeCardSkeleton,
  MenuToolbar,
  filterAndSortCakes,
  type SortOption,
} from '@/features/menu';
import type { CakeCategory } from '@/types';

type FilterOption = CakeCategory | 'All';

const SKELETON_COUNT = 6;

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  const { data, isLoading, isError } = useCakes({
    category: selectedCategory,
  });

  const displayedCakes = useMemo(
    () => (data ? filterAndSortCakes(data.cakes, search, sort) : []),
    [data, search, sort]
  );

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Page header */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-6xl mx-auto">
        <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
          Our Cakes
        </p>
        <h1 className="font-display text-5xl lg:text-6xl text-espresso mb-4">The Menu</h1>
        <p className="font-sans text-base text-espresso/60 max-w-lg leading-relaxed">
          All cakes are made to order. Prices shown are a guide — bespoke sizing, flavours, and
          decoration are always available on request.
        </p>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 lg:top-20 z-10 bg-warm/95 backdrop-blur-sm border-b border-espresso/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4">
          <MenuToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Cake grid */}
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
            <p className="font-sans text-espresso/50 text-sm">
              Could not load cakes. Please try again.
            </p>
          </div>
        )}

        {data && displayedCakes.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-espresso/40 mb-2">Nothing here yet</p>
            <p className="font-sans text-sm text-espresso/40">
              {search
                ? 'No cakes match your search. Try a different term.'
                : 'No cakes found in this category.'}
            </p>
          </div>
        )}

        {data && displayedCakes.length > 0 && (
          <>
            <p className="font-sans text-xs text-espresso/40 mb-8">
              {displayedCakes.length} of {data.total} {data.total === 1 ? 'cake' : 'cakes'}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              {search ? ` matching "${search}"` : ''}
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
