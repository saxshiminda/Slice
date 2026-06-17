import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui';
import type { ApiResponse, ShopOrder } from '@/types';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { clearCart } = useCartStore();
  const t = useT();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['shop-order', id],
    queryFn: () => api.get<ApiResponse<ShopOrder>>(`/api/shop/${id}`),
    select: (res) => res.data,
    enabled: !!id,
    retry: 3,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20 flex items-center justify-center">
        <Spinner size="lg" />
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <p className="font-sans text-espresso/60">{t.common.error}</p>
          <Link
            to="/"
            className="mt-4 inline-block font-sans text-sm text-rose hover:text-rose-dark"
          >
            {t.confirmation.continueShopping}
          </Link>
        </div>
      </main>
    );
  }

  const paid =
    order.status === 'PAID' ||
    order.status === 'CONFIRMED' ||
    order.status === 'READY' ||
    order.status === 'DELIVERED';

  return (
    <main className="min-h-screen pt-16 lg:pt-20 bg-cream">
      <div className="max-w-xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-center">
        {paid ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-rose/10 rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4967A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-espresso mb-4">
              {t.confirmation.success}
            </h1>
            <p className="font-sans text-base text-espresso/60 mb-8">{t.confirmation.successSub}</p>

            <div className="bg-warm p-6 text-left mb-8 space-y-4">
              <div className="flex justify-between font-sans text-sm">
                <span className="text-espresso/50">{t.confirmation.orderRef}</span>
                <span className="font-medium text-espresso">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <div className="border-t border-espresso/10 pt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between font-sans text-sm">
                    <span className="text-espresso">
                      {item.cakeName}
                      {item.variantName && (
                        <span className="text-espresso/50"> ({item.variantName})</span>
                      )}{' '}
                      ×{item.quantity}
                    </span>
                    <span className="text-espresso">₾{item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-espresso/10 pt-4 flex justify-between font-sans text-sm font-medium">
                <span className="text-espresso">{t.checkout.total}</span>
                <span className="text-espresso">₾{order.total.toFixed(2)}</span>
              </div>
            </div>

            <p className="font-sans text-sm text-espresso/50 mb-8">{t.confirmation.email}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h1 className="font-display text-4xl text-espresso mb-4">{t.confirmation.failed}</h1>
            <p className="font-sans text-base text-espresso/60 mb-8">{t.confirmation.failedSub}</p>
            <Link
              to="/checkout"
              className="inline-flex items-center px-8 py-4 bg-rose text-white text-sm font-sans font-medium hover:bg-rose-dark transition-colors mr-4"
            >
              {t.confirmation.tryAgain}
            </Link>
          </>
        )}

        <Link
          to="/menu"
          className="inline-flex items-center px-8 py-4 bg-cream text-espresso text-sm font-sans font-medium border border-espresso/20 hover:border-espresso transition-colors"
        >
          {t.confirmation.continueShopping}
        </Link>
      </div>
    </main>
  );
}
