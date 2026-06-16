import { Link, useParams } from 'react-router-dom';
import { useCake } from '@/features/menu/hooks/use-cake';
import { Badge, Spinner } from '@/components/ui';
import { useFadeIn } from '@/hooks/use-fade-in';

export function CakeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: cake, isLoading, isError } = useCake(id);
  const contentRef = useFadeIn<HTMLDivElement>();

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !cake) {
    return (
      <main className="min-h-screen pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-4xl text-espresso mb-4">Cake not found</h1>
          <p className="font-sans text-espresso/60 mb-8">This cake may no longer be available.</p>
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

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <div ref={contentRef} className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 font-sans text-sm text-espresso/50 hover:text-espresso transition-colors mb-8"
        >
          ← Back to menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="overflow-hidden bg-cream aspect-[4/3]">
            <img src={cake.imageUrl} alt={cake.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-4xl lg:text-5xl text-espresso leading-tight">
                {cake.name}
              </h1>
              <Badge category={cake.category} />
            </div>

            <p className="price text-3xl font-medium text-espresso mb-6">
              £{cake.price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
              <span className="font-sans text-sm text-espresso/40 ml-2">guide price</span>
            </p>

            <p className="font-sans text-base text-espresso/65 leading-relaxed mb-8 flex-1">
              {cake.description}
            </p>

            {cake.featured && (
              <p className="font-sans text-xs uppercase tracking-widest text-rose mb-6">
                Featured cake
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-6 border-t border-espresso/10">
              <Link
                to="/order"
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-rose text-white hover:bg-rose-dark transition-colors"
              >
                Order this style
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 text-sm font-sans font-medium bg-cream text-espresso border border-rose/30 hover:border-rose hover:bg-warm transition-colors"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
