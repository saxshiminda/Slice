import { useAdminOrders } from '@/features/admin';
import { Spinner } from '@/components/ui';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useAdminOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-2">Orders</h1>
      <p className="font-sans text-sm text-espresso/50 mb-8">
        Structured order requests from the order form.
      </p>

      {!orders?.length ? (
        <p className="font-sans text-sm text-espresso/40">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-cream border border-espresso/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-sans font-medium text-espresso">{order.name}</p>
                  <p className="font-sans text-sm text-espresso/50">{order.email}</p>
                </div>
                <p className="font-sans text-xs text-espresso/40">{formatDate(order.createdAt)}</p>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans mb-4">
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">Event</dt>
                  <dd className="text-espresso">{order.eventType}</dd>
                </div>
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">Date</dt>
                  <dd className="text-espresso">{order.eventDate}</dd>
                </div>
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">Servings</dt>
                  <dd className="text-espresso">{order.servings}</dd>
                </div>
                <div>
                  <dt className="text-espresso/40 text-xs uppercase tracking-wide">Category</dt>
                  <dd className="text-espresso">{order.category?.name ?? '—'}</dd>
                </div>
              </dl>

              {order.details && (
                <p className="font-sans text-sm text-espresso/70 leading-relaxed border-t border-espresso/10 pt-4">
                  {order.details}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
