import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCake } from '@/features/menu/hooks/use-cake';
import { CategoryBadge } from '@/features/menu/components/category-badge';
import { resolveImageSrc } from '@/lib/images';
import { Spinner } from '@/components/ui';
import { useFadeIn } from '@/hooks/use-fade-in';
import { useCartStore } from '@/store/cart';
import { useT } from '@/i18n';
import type { ProductVariant } from '@/types';

export function CakeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: cake, isLoading, isError } = useCake(id);
  const contentRef = useFadeIn<HTMLDivElement>();
  const { addItem, items } = useCartStore();
  const t = useT();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedFlash, setAddedFlash] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24 flex justify-center">
          <Spinner size="lg" />
        </div>
      </main>
    );
  }

  if (isError || !cake) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-4xl text-espresso mb-4">{t.cake.notFound}</h1>
          <p className="font-sans text-espresso/60 mb-8">{t.cake.notFoundSub}</p>
          <Link
            to="/menu"
            className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
          >
            Back to menu
          </Link>
        </div>
      </main>
    );
  }

  const activeVariants = cake.variants?.filter((v) => v.active) ?? [];
  const hasVariants = activeVariants.length > 0;

  const effectivePrice = selectedVariant ? selectedVariant.price : cake.price;
  const variantId = selectedVariant?.id ?? null;
  const variantName = selectedVariant?.name ?? null;

  const inCart = items.some((i) => i.cakeId === cake.id && i.variantId === variantId);

  const discountPct =
    cake.compareAtPrice && cake.compareAtPrice > cake.price
      ? Math.round((1 - cake.price / cake.compareAtPrice) * 100)
      : null;

  function handleAddToCart() {
    if (hasVariants && !selectedVariant) return;
    addItem({
      cakeId: cake!.id,
      cakeName: cake!.name,
      imageUrl: cake!.imageUrl,
      variantId,
      variantName,
      unitPrice: effectivePrice,
    });
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2000);
  }

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <div ref={contentRef} className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 font-sans text-sm text-espresso/50 hover:text-espresso transition-colors mb-8"
        >
          {t.cake.backToMenu}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="relative overflow-hidden bg-cream aspect-[4/3]">
            <img
              src={resolveImageSrc(cake.imageUrl)}
              alt={cake.name}
              className="w-full h-full object-cover"
            />
            {discountPct && (
              <span className="absolute top-4 left-4 bg-rose text-white font-sans text-sm font-medium px-3 py-1">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-4xl lg:text-5xl text-espresso leading-tight">
                {cake.name}
              </h1>
              <CategoryBadge category={cake.category} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <p className="price text-3xl font-medium text-espresso">
                ₾{effectivePrice.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
              </p>
              {cake.compareAtPrice && cake.compareAtPrice > cake.price && !selectedVariant && (
                <span className="font-sans text-lg text-espresso/40 line-through">
                  ₾{cake.compareAtPrice.toFixed(0)}
                </span>
              )}
              {!hasVariants && (
                <span className="font-sans text-sm text-espresso/40">{t.cake.guidePrice}</span>
              )}
            </div>

            <p className="font-sans text-base text-espresso/65 leading-relaxed mb-8 flex-1">
              {cake.description}
            </p>

            {/* Variants */}
            {hasVariants && (
              <div className="mb-6">
                <p className="font-sans text-xs uppercase tracking-widest text-espresso/40 mb-3">
                  {t.cake.variants}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
                      className={`px-4 py-2 text-sm font-sans border transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'bg-espresso text-warm border-espresso'
                          : 'bg-cream text-espresso border-espresso/20 hover:border-espresso'
                      }`}
                    >
                      {v.name} — ₾{v.price.toFixed(0)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cake.featured && (
              <p className="font-sans text-xs uppercase tracking-widest text-rose mb-6">
                Featured cake
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-6 border-t border-espresso/10">
              <button
                onClick={handleAddToCart}
                disabled={hasVariants && !selectedVariant}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-sans font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  inCart
                    ? 'bg-sage/20 text-sage'
                    : addedFlash
                      ? 'bg-sage text-white'
                      : 'bg-rose text-white hover:bg-rose-dark'
                }`}
              >
                {addedFlash ? '✓ Added!' : inCart ? t.menu.inCart : t.cake.addToCart}
              </button>
              <Link
                to={`/order?cake=${encodeURIComponent(cake.name)}`}
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-cream text-espresso border border-rose/30 hover:border-rose hover:bg-warm transition-colors"
              >
                {t.cake.orderThisStyle}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-transparent text-espresso/50 hover:text-espresso transition-colors"
              >
                {t.cake.askQuestion}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
