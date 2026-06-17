import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui';
import { useT } from '@/i18n';
import type { ApiResponse, ShopOrder, OrderStatus } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'PAID',
  'CONFIRMED',
  'READY',
  'DELIVERED',
  'CANCELLED',
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminShopOrdersPage() {
  const t = useT();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const qc = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'shop-orders', filterStatus],
    queryFn: () =>
      api.get<ApiResponse<ShopOrder[]>>(
        `/api/admin/shop-orders${filterStatus ? `?status=${filterStatus}` : ''}`
      ),
    select: (res) => res.data,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.patch<ApiResponse<ShopOrder>>(`/api/admin/shop-orders/${id}/status`, { status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'shop-orders'] });
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-2">{t.admin.shopOrders.title}</h1>
      <p className="font-sans text-sm text-espresso/50 mb-6">{t.admin.shopOrders.subtitle}</p>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors ${
            filterStatus === ''
              ? 'bg-espresso text-warm'
              : 'bg-cream text-espresso/60 hover:text-espresso'
          }`}
        >
          {t.admin.shopOrders.all}
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs font-sans font-medium transition-colors ${
              filterStatus === s
                ? 'bg-espresso text-warm'
                : 'bg-cream text-espresso/60 hover:text-espresso'
            }`}
          >
            {t.account.status[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : !orders?.length ? (
        <p className="font-sans text-sm text-espresso/40">{t.admin.shopOrders.noOrders}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-cream border border-espresso/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-sans font-medium text-espresso">
                    {order.customerName}
                    <span className="ml-2 font-normal text-espresso/40 text-sm">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                  </p>
                  <p className="font-sans text-sm text-espresso/50">{order.customerEmail}</p>
                  {order.customerPhone && (
                    <p className="font-sans text-sm text-espresso/50">{order.customerPhone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-sans text-xs text-espresso/40 mb-1">
                    {formatDate(order.createdAt)}
                  </p>
                  <span
                    className={`px-2.5 py-1 text-xs font-sans font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {t.account.status[order.status]}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans mb-4">
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">
                    {t.admin.shopOrders.type}
                  </dt>
                  <dd className="text-espresso">{order.fulfillmentType}</dd>
                </div>
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">
                    {t.admin.shopOrders.total}
                  </dt>
                  <dd className="text-espresso font-medium">₾{order.total.toFixed(2)}</dd>
                </div>
                {order.pickupDate && (
                  <div>
                    <dt className="text-espresso/40 text-xs uppercase tracking-wide">
                      {t.admin.shopOrders.date}
                    </dt>
                    <dd className="text-espresso">
                      {new Date(order.pickupDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {order.pickupSlot && ` ${order.pickupSlot}`}
                    </dd>
                  </div>
                )}
                {order.branch && (
                  <div>
                    <dt className="text-espresso/40 text-xs uppercase tracking-wide">
                      {t.admin.shopOrders.branch}
                    </dt>
                    <dd className="text-espresso">{order.branch.name}</dd>
                  </div>
                )}
              </dl>

              <ul className="space-y-1 mb-4 border-t border-espresso/10 pt-4">
                {order.items.map((item) => (
                  <li key={item.id} className="font-sans text-sm text-espresso/70">
                    {item.cakeName}
                    {item.variantName && (
                      <span className="text-espresso/40"> ({item.variantName})</span>
                    )}{' '}
                    ×{item.quantity}
                    <span className="text-espresso/40 ml-2">₾{item.total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {order.deliveryAddress && (
                <p className="font-sans text-sm text-espresso/60 mb-4">
                  📍 {order.deliveryAddress}
                </p>
              )}

              {order.notes && (
                <p className="font-sans text-sm text-espresso/60 mb-4 italic">{order.notes}</p>
              )}

              {/* Status update */}
              <div className="flex flex-wrap gap-2 border-t border-espresso/10 pt-4">
                <span className="font-sans text-xs text-espresso/40 self-center mr-2">
                  {t.admin.shopOrders.updateStatus}
                </span>
                {STATUS_OPTIONS.filter((s) => s !== order.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                    disabled={updateStatus.isPending}
                    className="px-3 py-1 text-xs font-sans border border-espresso/20 text-espresso/60 hover:border-rose hover:text-espresso transition-colors disabled:opacity-40"
                  >
                    → {t.account.status[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
