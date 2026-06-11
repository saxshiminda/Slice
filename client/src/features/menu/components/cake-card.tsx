import { useFadeIn } from '@/hooks/use-fade-in';
import { Card, Badge } from '@/components/ui';
import type { Cake } from '@/types';

interface Props {
  cake: Cake;
}

export function CakeCard({ cake }: Props) {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      <Card hoverable className="group">
        <div className="aspect-[4/3] overflow-hidden bg-warm">
          <img
            src={cake.imageUrl}
            alt={cake.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5 lg:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-lg text-espresso leading-snug">{cake.name}</h3>
            <Badge category={cake.category} />
          </div>
          <p className="text-sm text-espresso/60 leading-relaxed line-clamp-3 font-sans">
            {cake.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-display text-xl text-espresso">
              £{cake.price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
            </span>
            {cake.featured && (
              <span className="text-xs font-sans text-rose uppercase tracking-widest">
                Featured
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
