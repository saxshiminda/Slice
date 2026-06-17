import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/store/cart';
import { useCustomerAuthStore } from '@/store/customer-auth';
import { useCheckout, useDeliverySettings, useBranches, useTimeslots } from '@/features/checkout';
import { resolveImageSrc } from '@/lib/images';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui';

type FulfillmentType = 'PICKUP' | 'DELIVERY';

export function CheckoutPage() {
  const { items, total: cartTotal, clearCart } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const t = useT();

  const [searchParams] = useSearchParams();
  const paymentFailed = searchParams.get('payment') === 'failed';

  const { data: settings } = useDeliverySettings();
  const { data: branches } = useBranches();
  const { data: timeslots } = useTimeslots();

  const checkout = useCheckout();

  const [form, setForm] = useState({
    customerName: customer?.name ?? '',
    customerEmail: customer?.email ?? '',
    customerPhone: customer?.phone ?? '',
    fulfillmentType: 'PICKUP' as FulfillmentType,
    notes: '',
    pickupDate: '',
    pickupSlot: '',
    deliveryAddress: '',
    branchId: '',
  });

  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  if (items.length === 0 && !paymentFailed) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-4xl text-espresso mb-4">{t.cart.empty}</h1>
          <Link
            to="/menu"
            className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
          >
            {t.cart.emptyAction}
          </Link>
        </div>
      </main>
    );
  }

  const isDelivery = form.fulfillmentType === 'DELIVERY';
  const rawSubtotal = cartTotal();

  let deliveryFee = 0;
  if (isDelivery && settings) {
    const threshold = settings.freeDeliveryThreshold;
    deliveryFee =
      threshold !== null && threshold !== undefined && rawSubtotal >= threshold
        ? 0
        : settings.deliveryFee;
  }
  const total = rawSubtotal + deliveryFee;

  const minOrder = settings?.minOrderAmount ?? 0;
  const belowMin = rawSubtotal < minOrder;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (belowMin) {
      setError(`Minimum order amount is ₾${minOrder.toFixed(2)}`);
      return;
    }
    if (isDelivery && !form.deliveryAddress.trim()) {
      setError('Please enter your delivery address.');
      return;
    }
    setError('');
    try {
      await checkout.mutateAsync({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        fulfillmentType: form.fulfillmentType,
        items: items.map((i) => ({
          cakeId: i.cakeId,
          variantName: i.variantName ?? undefined,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        notes: form.notes || undefined,
        pickupDate: form.pickupDate || undefined,
        pickupSlot: form.pickupSlot || undefined,
        deliveryAddress: form.deliveryAddress || undefined,
        branchId: form.branchId || undefined,
      });
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    }
  }

  return (
    <main className="min-h-screen pt-16 lg:pt-20 bg-cream">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        {paymentFailed && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 font-sans text-sm">
            {t.confirmation.failedSub}
          </div>
        )}

        <div className="mb-8">
          <Link
            to="/menu"
            className="font-sans text-sm text-espresso/50 hover:text-espresso transition-colors"
          >
            {t.checkout.backToCart}
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl text-espresso mt-3">
            {t.checkout.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left — form fields */}
            <div className="lg:col-span-3 space-y-8">
              {/* Contact */}
              <section className="bg-warm p-8">
                <h2 className="font-display text-2xl text-espresso mb-6">{t.checkout.contact}</h2>
                <div className="space-y-4">
                  <Field label={t.checkout.name} required>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => set('customerName', e.target.value)}
                      className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                    />
                  </Field>
                  <Field label={t.checkout.email} required>
                    <input
                      type="email"
                      required
                      value={form.customerEmail}
                      onChange={(e) => set('customerEmail', e.target.value)}
                      className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                    />
                  </Field>
                  <Field label={t.checkout.phone}>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={(e) => set('customerPhone', e.target.value)}
                      className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                    />
                  </Field>
                </div>
              </section>

              {/* Fulfillment */}
              <section className="bg-warm p-8">
                <h2 className="font-display text-2xl text-espresso mb-6">
                  {t.checkout.fulfillment}
                </h2>
                <div className="flex gap-4 mb-6">
                  {(['PICKUP', 'DELIVERY'] as const).map((type) => {
                    const disabled =
                      type === 'DELIVERY'
                        ? settings && !settings.deliveryAvailable
                        : settings && !settings.pickupAvailable;
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={!!disabled}
                        onClick={() => set('fulfillmentType', type)}
                        className={`flex-1 px-4 py-3 text-sm font-sans font-medium border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          form.fulfillmentType === type
                            ? 'bg-espresso text-warm border-espresso'
                            : 'bg-cream text-espresso border-espresso/20 hover:border-espresso'
                        }`}
                      >
                        {type === 'PICKUP' ? t.checkout.pickup : t.checkout.delivery}
                      </button>
                    );
                  })}
                </div>

                {!isDelivery ? (
                  <div className="space-y-4">
                    {branches && branches.length > 0 && (
                      <Field label={t.checkout.branch}>
                        <select
                          value={form.branchId}
                          onChange={(e) => set('branchId', e.target.value)}
                          className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                        >
                          <option value="">{t.checkout.selectBranch}</option>
                          {branches
                            .filter((b) => b.pickupAvailable)
                            .map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name} — {b.address}
                              </option>
                            ))}
                        </select>
                      </Field>
                    )}

                    <Field label={t.checkout.pickupDate}>
                      <input
                        type="date"
                        value={form.pickupDate}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        onChange={(e) => set('pickupDate', e.target.value)}
                        className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                      />
                    </Field>

                    {timeslots && timeslots.length > 0 && (
                      <Field label={t.checkout.pickupSlot}>
                        <select
                          value={form.pickupSlot}
                          onChange={(e) => set('pickupSlot', e.target.value)}
                          className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose"
                        >
                          <option value="">{t.checkout.selectSlot}</option>
                          {timeslots.map((s) => (
                            <option key={s.id} value={s.label}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  </div>
                ) : (
                  <Field label={t.checkout.deliveryAddress} required>
                    <textarea
                      required
                      rows={3}
                      value={form.deliveryAddress}
                      onChange={(e) => set('deliveryAddress', e.target.value)}
                      className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose resize-none"
                    />
                  </Field>
                )}
              </section>

              {/* Notes */}
              <section className="bg-warm p-8">
                <Field label={t.checkout.notes}>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    className="w-full border border-espresso/20 bg-cream px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose resize-none"
                  />
                </Field>
              </section>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-2">
              <div className="bg-warm p-8 sticky top-24">
                <h2 className="font-display text-2xl text-espresso mb-6">
                  {t.checkout.orderSummary}
                </h2>
                <ul className="space-y-3 mb-6">
                  {items.map((item) => (
                    <li
                      key={`${item.cakeId}-${item.variantId ?? ''}`}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-12 h-12 flex-shrink-0 bg-cream overflow-hidden">
                        <img
                          src={resolveImageSrc(item.imageUrl)}
                          alt={item.cakeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-espresso truncate">{item.cakeName}</p>
                        {item.variantName && (
                          <p className="font-sans text-xs text-espresso/40">{item.variantName}</p>
                        )}
                        <p className="font-sans text-xs text-espresso/50">×{item.quantity}</p>
                      </div>
                      <p className="font-sans text-sm font-medium text-espresso">
                        ₾{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-espresso/10 pt-4 font-sans text-sm">
                  <div className="flex justify-between text-espresso/60">
                    <span>{t.checkout.subtotal}</span>
                    <span>₾{rawSubtotal.toFixed(2)}</span>
                  </div>
                  {isDelivery && (
                    <div className="flex justify-between text-espresso/60">
                      <span>{t.checkout.deliveryFee}</span>
                      <span>
                        {deliveryFee === 0 ? t.checkout.free : `₾${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  {settings?.freeDeliveryThreshold && isDelivery && deliveryFee > 0 && (
                    <p className="text-xs text-espresso/40">
                      Free delivery from ₾{settings.freeDeliveryThreshold.toFixed(0)}
                    </p>
                  )}
                  <div className="flex justify-between text-espresso font-medium text-base border-t border-espresso/10 pt-3">
                    <span>{t.checkout.total}</span>
                    <span>₾{total.toFixed(2)}</span>
                  </div>
                </div>

                {belowMin && (
                  <p className="font-sans text-xs text-red-600 mt-3">
                    {t.cart.minOrder}: ₾{minOrder.toFixed(2)}
                  </p>
                )}

                {error && <p className="font-sans text-xs text-red-600 mt-3">{error}</p>}

                <button
                  type="submit"
                  disabled={checkout.isPending || belowMin}
                  className="w-full mt-6 px-6 py-4 bg-rose text-white text-sm font-sans font-medium hover:bg-rose-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkout.isPending ? (
                    <>
                      <Spinner size="sm" />
                      {t.checkout.processing}
                    </>
                  ) : (
                    t.checkout.placeOrder
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1">
        {label}
        {required && <span className="text-rose ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
