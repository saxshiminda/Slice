import { useAdminInquiries } from '@/features/admin';
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

export function AdminInquiriesPage() {
  const { data: inquiries, isLoading } = useAdminInquiries();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-2">Contact enquiries</h1>
      <p className="font-sans text-sm text-espresso/50 mb-8">
        Messages submitted via the contact form.
      </p>

      {!inquiries?.length ? (
        <p className="font-sans text-sm text-espresso/40">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-cream border border-espresso/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-sans font-medium text-espresso">{inquiry.name}</p>
                  <p className="font-sans text-sm text-espresso/50">{inquiry.email}</p>
                </div>
                <p className="font-sans text-xs text-espresso/40">
                  {formatDate(inquiry.createdAt)}
                </p>
              </div>
              <p className="font-sans text-sm text-espresso/70 leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
