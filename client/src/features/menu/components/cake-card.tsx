import { Link } from 'react-router-dom';
import { useFadeIn } from '@/hooks/use-fade-in';
import { Card } from '@/components/ui';
import { CategoryBadge } from './category-badge';
import { resolveImageSrc } from '@/lib/images';
import { useCartStore } from '@/store/cart';
import { useT } from '@/i18n';
import type { Cake } from '@/types';

interface Props {
  cake: Cake;
}

export function CakeCard({ cake }: Props) {
  const ref = useFadeIn<HTMLDivElement>();
  const { addItem, items } = useCartStore();
  const t = useT();

  const inCart = items.some((i) => i.cakeId === cake.id && i.variantId === null);
  const hasVariants = cake.variants && cake.variants.length > 0;

  const discountPct =
    cake.compareAtPrice && cake.compareAtPrice > cake.price
      ? Math.round((1 - cake.price / cake.compareAtPrice) * 100)
      : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) return; // let detail page handle variants
    addItem({
      cakeId: cake.id,
      cakeName: cake.name,
      imageUrl: cake.imageUrl,
      variantId: null,
      variantName: null,
      unitPrice: cake.price,
    });
  }

  return (
    <div ref={ref} className="h-full">
      <Link to={`/menu/${cake.id}`} className="block h-full">
        <Card hoverable className="group flex flex-col h-full">
          <div className="relative h-60 flex-shrink-0 overflow-hidden bg-warm">
            <img
              src={resolveImageSrc(cake.imageUrl)}
              alt={cake.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {discountPct && (
              <span className="absolute top-3 left-3 bg-rose text-white font-sans text-xs font-medium px-2 py-0.5">
                -{discountPct}%
              </span>
            )}
          </div>
          <div className="p-5 lg:p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display text-lg text-espresso leading-snug">{cake.name}</h3>
              <CategoryBadge category={cake.category} />
            </div>
            <p className="text-sm text-espresso/60 leading-relaxed line-clamp-3 font-sans flex-1">
              {cake.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="price text-xl text-espresso">
                  ₾{cake.price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
                </span>
                {cake.compareAtPrice && cake.compareAtPrice > cake.price && (
                  <span className="font-sans text-sm text-espresso/40 line-through">
                    ₾{cake.compareAtPrice.toFixed(0)}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-sans font-medium transition-colors ${
                  inCart
                    ? 'bg-sage/20 text-sage cursor-default'
                    : hasVariants
                      ? 'bg-cream text-espresso/60 border border-espresso/20 hover:border-rose hover:text-espresso'
                      : 'bg-rose text-white hover:bg-rose-dark'
                }`}
              >
                {inCart ? t.menu.inCart : hasVariants ? t.cake.variants : t.menu.addToCart}
              </button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
