import { OrderForm } from '@/features/order';
import { useFadeIn } from '@/hooks/use-fade-in';
import { Link } from 'react-router-dom';

const steps = [
  {
    n: '01',
    title: 'Submit your request',
    body: 'Fill in the form with your event details and any design ideas you have in mind.',
  },
  {
    n: '02',
    title: 'We get in touch',
    body: 'Within 48 hours we will reach out to discuss flavours, design, and confirm availability.',
  },
  {
    n: '03',
    title: 'Your cake is made',
    body: 'We bake everything to order. Your cake arrives fresh, exactly as designed.',
  },
];

export function OrderPage() {
  const heroRef = useFadeIn<HTMLDivElement>();
  const stepsRef = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Page header */}
      <section className="bg-espresso py-16 lg:py-24 px-6 lg:px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto">
          <p className="font-sans text-xs tracking-widest uppercase text-rose mb-3">
            Place an Order
          </p>
          <h1 className="font-display text-5xl lg:text-6xl text-warm leading-tight mb-4">
            Let's make your cake.
          </h1>
          <p className="font-sans text-base text-warm/60 max-w-lg leading-relaxed">
            Complete the form below and we will be in touch within 48 hours to confirm details and
            availability. All cakes are made to order — minimum six weeks lead time for custom and
            wedding cakes.
          </p>
        </div>
      </section>

      {/* How it works strip */}
      <section className="bg-cream py-12 px-6 lg:px-8 border-b border-espresso/8">
        <div ref={stepsRef} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <span className="font-display text-3xl text-rose/40 leading-none flex-shrink-0">
                {n}
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
              <h2 className="font-display text-3xl text-espresso mb-3">Order details</h2>
              <p className="font-sans text-sm text-espresso/55 leading-relaxed">
                The more detail you give us the better. Don't worry about being too specific — we
                can always adjust at the consultation stage.
              </p>
            </div>

            <div className="space-y-5 border-t border-espresso/10 pt-6">
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  Response time
                </p>
                <p className="font-sans text-sm text-espresso/70">Within 48 hours</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  Lead time
                </p>
                <p className="font-sans text-sm text-espresso/70">6 weeks minimum</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  Not sure yet?
                </p>
                <Link
                  to="/menu"
                  className="font-sans text-sm text-rose hover:text-rose-dark transition-colors"
                >
                  Browse the menu →
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
