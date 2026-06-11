import { Link } from 'react-router-dom';
import { useCakes } from '@/features/menu';
import { CakeCard } from '@/features/menu';
import { Spinner } from '@/components/ui';
import { useFadeIn } from '@/hooks/use-fade-in';

function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Full-bleed image */}
      <img
        src="https://picsum.photos/seed/slice-hero/1600/900"
        alt="A beautiful artisan cake"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 via-espresso/30 to-transparent" />

      {/* Headline — overlaid on the image plane */}
      <div className="relative h-full flex items-end pb-16 lg:pb-24 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <p className="font-sans text-xs tracking-widest uppercase text-warm/70 mb-4">
            Artisan Patisserie
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-warm leading-[0.95] mb-6">
            Made with flour, butter, and intention.
          </h1>
          <p className="font-sans text-base text-warm/70 leading-relaxed mb-8 max-w-sm">
            Each cake is baked to order — unhurried, unfussy, and unapologetically good.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-warm text-espresso text-sm font-sans font-medium tracking-wide hover:bg-rose hover:text-white transition-all duration-300"
            >
              View the Menu
            </Link>
            <Link
              to="/contact"
              className="text-sm font-sans font-medium text-warm/80 hover:text-warm underline underline-offset-4 transition-colors"
            >
              Order a custom cake
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStatement() {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-6xl mx-auto">
      <div
        ref={ref}
        style={{ opacity: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <div>
          <h2 className="font-display text-4xl lg:text-5xl text-espresso leading-tight">
            A cake should taste as good as it looks.
          </h2>
        </div>
        <div>
          <p className="font-sans text-base text-espresso/60 leading-relaxed mb-4">
            Slice is a one-person patisserie studio built on the belief that a celebration cake
            should be worth remembering. No frozen sponges, no box mixes. Every layer is baked from
            scratch using the finest seasonal ingredients.
          </p>
          <p className="font-sans text-base text-espresso/60 leading-relaxed">
            Whether it is a towering wedding centrepiece or a birthday cake for twenty, every order
            receives the same care and attention.
          </p>
          <Link
            to="/about"
            className="inline-block mt-6 text-sm font-sans font-medium text-rose hover:text-rose-dark underline underline-offset-4 transition-colors"
          >
            Our story →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCakes() {
  const { data, isLoading, isError } = useCakes({ featured: true });
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          style={{ opacity: 0 }}
          className="flex items-end justify-between mb-12 lg:mb-16"
        >
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
              Selected Works
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-espresso">Featured cakes</h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-block text-sm font-sans font-medium text-espresso/60 hover:text-espresso transition-colors"
          >
            View all →
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <p className="text-center text-espresso/50 py-16 font-sans text-sm">
            Could not load cakes at this time.
          </p>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data.cakes.slice(0, 3).map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link
            to="/menu"
            className="text-sm font-sans font-medium text-espresso/60 hover:text-espresso transition-colors"
          >
            View all cakes →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-6xl mx-auto text-center">
      <div ref={ref} style={{ opacity: 0 }}>
        <h2 className="font-display text-4xl lg:text-5xl text-espresso mb-4">
          Have something in mind?
        </h2>
        <p className="font-sans text-base text-espresso/60 max-w-md mx-auto leading-relaxed mb-8">
          Custom orders are always welcome. Tell us about your event and we will design something
          together.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-rose text-white text-sm font-sans font-medium tracking-wide hover:bg-rose-dark transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandStatement />
      <FeaturedCakes />
      <CtaBanner />
    </>
  );
}
