import { ContactForm } from '@/features/contact';
import { useFadeIn } from '@/hooks/use-fade-in';
import { useT } from '@/i18n';

export function ContactPage() {
  const ref = useFadeIn<HTMLDivElement>();
  const t = useT();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — intro text */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
              {t.contact.tagline}
            </p>
            <h1 className="font-display text-5xl lg:text-6xl text-espresso leading-tight mb-8">
              {t.contact.heading}
            </h1>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              {t.contact.body1}
            </p>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              {t.contact.body2}
            </p>

            <div className="mt-10 space-y-4 border-t border-espresso/10 pt-8">
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  {t.contact.responseTime}
                </p>
                <p className="font-sans text-sm text-espresso/70">{t.contact.responseTimeValue}</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  {t.contact.leadTime}
                </p>
                <p className="font-sans text-sm text-espresso/70">{t.contact.leadTimeValue}</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-cream p-8 lg:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
