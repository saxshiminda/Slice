import { Link } from 'react-router-dom';
import { useFadeIn } from '@/hooks/use-fade-in';
import { Card, Badge } from '@/components/ui';
import type { Cake } from '@/types';

interface Props {
  cake: Cake;
}

export function CakeCard({ cake }: Props) {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <div ref={ref} className="h-full">
      <Link to={`/menu/${cake.id}`} className="block h-full">
        <Card hoverable className="group flex flex-col h-full">
          {/* Fixed-height image — always 240px regardless of source aspect ratio */}
          <div className="h-60 flex-shrink-0 overflow-hidden bg-warm">
            <img
              src={cake.imageUrl}
              alt={cake.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-5 lg:p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display text-lg text-espresso leading-snug">{cake.name}</h3>
              <Badge category={cake.category} />
            </div>
            <p className="text-sm text-espresso/60 leading-relaxed line-clamp-3 font-sans flex-1">
              {cake.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="price text-xl text-espresso">
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
      </Link>
    </div>
  );
}
