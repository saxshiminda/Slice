import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCustomerAuthStore } from '@/store/customer-auth';
import { useT } from '@/i18n';
import { Spinner, Button } from '@/components/ui';
import type { ApiResponse, ShopOrder, OrderStatus, Customer } from '@/types';

type Tab = 'orders' | 'profile';

function statusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PAID':
      return 'bg-blue-100 text-blue-800';
    case 'CONFIRMED':
      return 'bg-indigo-100 text-indigo-800';
    case 'READY':
      return 'bg-green-100 text-green-800';
    case 'DELIVERED':
      return 'bg-sage/20 text-sage';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-cream text-espresso/60';
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  return (
    <div className="w-16 h-16 rounded-full bg-rose flex items-center justify-center flex-shrink-0">
      <span className="font-display text-2xl text-white">{initials}</span>
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────

function OrdersTab() {
  const t = useT();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => api.get<ApiResponse<ShopOrder[]>>('/api/customers/me/orders'),
    select: (res) => res.data,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-3xl text-espresso/20 mb-3">0</p>
        <p className="font-sans text-sm text-espresso/40">{t.account.noOrders}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-cream border border-espresso/10">
          {/* Order header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-espresso/8">
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm font-medium text-espresso">
                #{order.id.slice(-6).toUpperCase()}
              </span>
              <span className="text-espresso/20">·</span>
              <span className="font-sans text-xs text-espresso/40">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-sans font-medium rounded-sm ${statusColor(order.status)}`}
            >
              {t.account.status[order.status]}
            </span>
          </div>

          {/* Items */}
          <div className="px-6 py-4">
            <ul className="space-y-1.5 mb-4">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between font-sans text-sm">
                  <span className="text-espresso/80">
                    {item.cakeName}
                    {item.variantName && (
                      <span className="text-espresso/40"> · {item.variantName}</span>
                    )}
                    <span className="text-espresso/40"> ×{item.quantity}</span>
                  </span>
                  <span className="text-espresso/60 tabular-nums">₾{item.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-espresso/8 pt-3">
              <span className="font-sans text-xs text-espresso/40 uppercase tracking-wide">
                {order.fulfillmentType === 'DELIVERY'
                  ? t.account.fulfillmentDelivery
                  : t.account.fulfillmentPickup}
                {order.pickupDate && ` · ${formatDate(order.pickupDate)}`}
              </span>
              <span className="font-sans text-sm font-medium text-espresso">
                ₾{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

function ProfileTab({ customer }: { customer: Customer }) {
  const t = useT();
  const { updateCustomer, logout } = useCustomerAuthStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone ?? '');
  const [saved, setSaved] = useState(false);

  const update = useMutation({
    mutationFn: (data: { name: string; phone?: string | null }) =>
      api.patch<ApiResponse<Customer>>('/api/customers/me', data),
    onSuccess: (res) => {
      updateCustomer(res.data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    update.mutate({
      name: name.trim() || customer.name,
      phone: phone.trim() || null,
    });
  }

  function handleCancel() {
    setName(customer.name);
    setPhone(customer.phone ?? '');
    setEditing(false);
  }

  function handleSignOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="max-w-md space-y-8">
      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <InitialAvatar name={customer.name} />
        <div>
          <p className="font-display text-2xl text-espresso">{customer.name}</p>
          <p className="font-sans text-xs text-espresso/40 mt-0.5">
            {t.account.memberSince} {formatMonthYear(customer.createdAt)}
          </p>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-cream border border-espresso/10 p-6">
        {!editing ? (
          /* Read view */
          <div className="space-y-5">
            <Field label={t.account.name} value={customer.name} />
            <Field label={t.account.email} value={customer.email} note={t.account.emailReadOnly} />
            <Field
              label={t.account.phone}
              value={customer.phone || t.account.noPhone}
              muted={!customer.phone}
            />

            <div className="flex items-center gap-4 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
                {t.account.editProfile}
              </Button>
              {saved && (
                <span className="font-sans text-sm text-sage animate-fade-in">
                  {t.account.saved}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Edit form */
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1.5">
                {t.account.name}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-espresso/20 bg-warm px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose transition-colors"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1.5">
                {t.account.email}
              </label>
              <input
                type="email"
                disabled
                value={customer.email}
                className="w-full border border-espresso/10 bg-espresso/5 px-4 py-3 font-sans text-sm text-espresso/40 cursor-not-allowed"
              />
              <p className="font-sans text-xs text-espresso/30 mt-1">{t.account.emailReadOnly}</p>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-espresso/50 mb-1.5">
                {t.account.phone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+995 5xx xxx xxx"
                className="w-full border border-espresso/20 bg-warm px-4 py-3 font-sans text-sm text-espresso focus:outline-none focus:border-rose transition-colors"
              />
            </div>

            {update.isError && <p className="font-sans text-sm text-red-600">{t.common.error}</p>}

            <div className="flex gap-3 pt-1">
              <Button type="submit" loading={update.isPending}>
                {update.isPending ? t.account.saving : t.account.saveChanges}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                {t.account.cancelEdit}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Sign out */}
      <div className="border-t border-espresso/10 pt-6">
        <button
          type="button"
          onClick={handleSignOut}
          className="font-sans text-sm text-espresso/40 hover:text-espresso transition-colors"
        >
          {t.account.signOut} →
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  note,
  muted,
}: {
  label: string;
  value: string;
  note?: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-espresso/40 mb-1">{label}</p>
      <p className={`font-sans text-sm ${muted ? 'text-espresso/30 italic' : 'text-espresso'}`}>
        {value}
      </p>
      {note && <p className="font-sans text-xs text-espresso/30 mt-0.5">{note}</p>}
    </div>
  );
}

// ─── Page shell ──────────────────────────────────────────────────────────────

export function AccountPage() {
  const t = useT();
  const { customer } = useCustomerAuthStore();
  const [tab, setTab] = useState<Tab>('orders');

  if (!customer) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        {/* Page heading */}
        <div className="flex items-center gap-5 mb-10">
          <InitialAvatar name={customer.name} />
          <div>
            <h1 className="font-display text-3xl lg:text-4xl text-espresso">{customer.name}</h1>
            <p className="font-sans text-sm text-espresso/50 mt-0.5">{customer.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-espresso/10 mb-8">
          {(
            [
              { key: 'orders', label: t.account.tabOrders },
              { key: 'profile', label: t.account.tabProfile },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === key
                  ? 'border-rose text-espresso'
                  : 'border-transparent text-espresso/40 hover:text-espresso/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'orders' ? <OrdersTab /> : <ProfileTab customer={customer} />}
      </div>
    </main>
  );
}
