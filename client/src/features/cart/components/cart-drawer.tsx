import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cart';
import { useT } from '@/i18n';
import { resolveImageSrc } from '@/lib/images';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount } = useCartStore();
  const t = useT();

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-espresso/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-warm shadow-2xl flex flex-col"
        role="dialog"
        aria-label={t.cart.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-espresso/10">
          <h2 className="font-display text-2xl text-espresso">
            {t.cart.title}
            {itemCount() > 0 && (
              <span className="ml-2 font-sans text-sm text-espresso/40">({itemCount()})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-espresso/40 hover:text-espresso transition-colors"
            aria-label="Close cart"
          >
            <span className="block w-5 h-0.5 bg-current rotate-45 translate-y-[1px]" />
            <span className="block w-5 h-0.5 bg-current -rotate-45" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <span className="text-4xl">🛒</span>
              <p className="font-sans text-espresso/50">{t.cart.empty}</p>
              <button
                onClick={closeCart}
                className="font-sans text-sm text-rose hover:text-rose-dark transition-colors underline underline-offset-4"
              >
                {t.cart.emptyAction}
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.cakeId}-${item.variantId ?? 'default'}`}
                  className="flex gap-4 pb-4 border-b border-espresso/8 last:border-0"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-cream overflow-hidden">
                    <img
                      src={resolveImageSrc(item.imageUrl)}
                      alt={item.cakeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-espresso truncate">
                      {item.cakeName}
                    </p>
                    {item.variantName && (
                      <p className="font-sans text-xs text-espresso/50">{item.variantName}</p>
                    )}
                    <p className="font-sans text-sm text-espresso mt-1">
                      ₾{(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.cakeId, item.variantId)}
                      className="font-sans text-xs text-espresso/30 hover:text-espresso/60 transition-colors"
                    >
                      {t.cart.remove}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.cakeId, item.variantId, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-espresso/60 hover:text-espresso border border-espresso/20 text-sm transition-colors"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="font-sans text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cakeId, item.variantId, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center text-espresso/60 hover:text-espresso border border-espresso/20 text-sm transition-colors"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-espresso/10 space-y-4">
            <div className="flex items-center justify-between font-sans text-sm">
              <span className="text-espresso/60">{t.cart.subtotal}</span>
              <span className="font-medium text-espresso">₾{subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full px-6 py-4 bg-rose text-white text-sm font-sans font-medium text-center hover:bg-rose-dark transition-colors"
            >
              {t.cart.checkout} →
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
