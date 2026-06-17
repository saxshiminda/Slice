import { OrderForm } from '@/features/order';
import { useFadeIn } from '@/hooks/use-fade-in';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';

export function OrderPage() {
  const heroRef = useFadeIn<HTMLDivElement>();
  const stepsRef = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Page header */}
      <section className="bg-espresso py-16 lg:py-24 px-6 lg:px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto">
          <p className="font-sans text-xs tracking-widest uppercase text-rose mb-3">
            {t.order.tagline}
          </p>
          <h1 className="font-display text-5xl lg:text-6xl text-warm leading-tight mb-4">
            {t.order.heading}
          </h1>
          <p className="font-sans text-base text-warm/60 max-w-lg leading-relaxed">{t.order.sub}</p>
        </div>
      </section>

      {/* How it works strip */}
      <section className="bg-cream py-12 px-6 lg:px-8 border-b border-espresso/8">
        <div ref={stepsRef} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {t.order.steps.map(({ title, body }, i) => (
            <div key={i} className="flex gap-4">
              <span className="font-display text-3xl text-rose/40 leading-none flex-shrink-0">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg text-espresso mb-1">{title}</h3>
                <p className="font-sans text-sm text-espresso/55 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-3xl text-espresso mb-3">{t.order.formHeading}</h2>
              <p className="font-sans text-sm text-espresso/55 leading-relaxed">
                {t.order.formSub}
              </p>
            </div>

            <div className="space-y-5 border-t border-espresso/10 pt-6">
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  {t.order.responseTime}
                </p>
                <p className="font-sans text-sm text-espresso/70">{t.order.responseTimeValue}</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  {t.order.leadTime}
                </p>
                <p className="font-sans text-sm text-espresso/70">{t.order.leadTimeValue}</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  {t.order.notSure}
                </p>
                <Link
                  to="/menu"
                  className="font-sans text-sm text-rose hover:text-rose-dark transition-colors"
                >
                  {t.order.browseMenu}
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-cream p-8 lg:p-10">
            <OrderForm />
          </div>
        </div>
      </section>
    </main>
  );
}
