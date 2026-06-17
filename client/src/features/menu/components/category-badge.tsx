import { Badge } from '@/components/ui';
import type { Category } from '@/types';

interface Props {
  category: Category;
}

const slugStyles: Record<string, string> = {
  wedding: 'bg-rose/10 text-rose-dark',
  birthday: 'bg-sage/15 text-sage',
  seasonal: 'bg-espresso/8 text-espresso/70',
  custom: 'bg-cream text-espresso/60 border border-espresso/15',
};

export function CategoryBadge({ category }: Props) {
  const style = slugStyles[category.slug] ?? 'bg-cream text-espresso/60 border border-espresso/15';

  return <Badge label={category.name} className={style} />;
}
