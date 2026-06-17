import { Link } from 'react-router-dom';
import { useCakes, CakeCard } from '@/features/menu';
import { Spinner } from '@/components/ui';
import { useFadeIn } from '@/hooks/use-fade-in';
import { SITE_IMAGES } from '@/lib/images';
import { useT } from '@/i18n';

function HeroSection() {
  const t = useT();

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      <img
        src={SITE_IMAGES.hero}
        alt="An exquisite mirror-glaze cake"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/40 to-espresso/10" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose" />

      <div className="relative h-full flex items-end pb-20 lg:pb-28 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="font-sans text-xs tracking-widest uppercase text-rose mb-4">
            {t.home.hero.tagline}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-warm leading-[0.92] mb-6">
            {t.home.hero.heading}
          </h1>
          <p className="font-sans text-base text-warm/75 leading-relaxed mb-10 max-w-sm">
            {t.home.hero.sub}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-4 bg-rose text-white text-sm font-sans font-medium tracking-wide hover:bg-rose-dark transition-all duration-300"
            >
              {t.home.hero.cta}
            </Link>
            <Link
              to="/contact"
              className="text-sm font-sans font-medium text-warm/80 hover:text-warm underline underline-offset-4 transition-colors"
            >
              {t.home.hero.ctaCustom}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStatement() {
  const ref = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-warm to-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <span className="inline-block w-10 h-0.5 bg-rose mb-6" />
            <h2 className="font-display text-4xl lg:text-5xl text-espresso leading-tight">
              {t.home.brand.heading}
            </h2>
          </div>
          <div>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-4">
              {t.home.brand.body1}
            </p>
            <p className="font-sans text-base text-espresso/60 leading-relaxed">
              {t.home.brand.body2}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 text-sm font-sans font-medium text-rose hover:text-rose-dark transition-colors"
            >
              {t.home.brand.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const t = useT();

  const stats = [
    { value: '500+', label: t.home.stats.cakesCreated },
    { value: '6 weeks', label: t.home.stats.leadTime },
    { value: '100%', label: t.home.stats.madeFromScratch },
    { value: '4', label: t.home.stats.collections },
  ];

  return (
    <section className="bg-espresso py-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl lg:text-4xl text-rose mb-1">{value}</p>
              <p className="font-sans text-xs tracking-widest uppercase text-warm/40">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCakes() {
  const { data, isLoading, isError } = useCakes({ featured: true });
  const headerRef = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-rose/80 mb-3">
              {t.home.featured.label}
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-espresso">
              {t.home.featured.heading}
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-block text-sm font-sans font-medium text-espresso/50 hover:text-espresso transition-colors"
          >
            {t.home.featured.viewAll}
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <p className="text-center text-espresso/50 py-16 font-sans text-sm">
            {t.home.featured.loadError}
          </p>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {data.cakes.slice(0, 3).map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link
            to="/menu"
            className="text-sm font-sans font-medium text-espresso/60 hover:text-espresso"
          >
            {t.home.featured.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}

function InspoBand() {
  const ref = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <img
        src={SITE_IMAGES.inspo}
        alt="Elegant tiered wedding cake"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-espresso/60" />
      <div ref={ref} className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-rose mb-4">
          {t.home.inspo.label}
        </p>
        <h2 className="font-display text-4xl lg:text-6xl text-warm max-w-2xl mx-auto leading-tight">
          {t.home.inspo.heading}
        </h2>
      </div>
    </section>
  );
}

function CtaBanner() {
  const ref = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <section className="bg-rose py-20 lg:py-28 px-6 lg:px-8">
      <div ref={ref} className="max-w-6xl mx-auto text-center">
        <h2 className="font-display text-4xl lg:text-5xl text-white mb-4">{t.home.cta.heading}</h2>
        <p className="font-sans text-base text-white/75 max-w-md mx-auto leading-relaxed mb-10">
          {t.home.cta.sub}
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose text-sm font-sans font-medium tracking-wide hover:bg-cream transition-colors"
        >
          {t.home.cta.button}
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
      <StatsStrip />
      <FeaturedCakes />
      <InspoBand />
      <CtaBanner />
    </>
  );
}
