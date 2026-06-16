import type { SortOption } from '../components/menu-toolbar';
import type { Cake } from '@/types';

export function filterAndSortCakes(cakes: Cake[], search: string, sort: SortOption): Cake[] {
  let result = cakes;

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (cake) =>
        cake.name.toLowerCase().includes(query) || cake.description.toLowerCase().includes(query)
    );
  }

  switch (sort) {
    case 'name':
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc':
      return [...result].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...result].sort((a, b) => b.price - a.price);
    default:
      return result;
  }
}
