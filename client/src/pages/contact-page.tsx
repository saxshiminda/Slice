import { ContactForm } from '@/features/contact';
import { useFadeIn } from '@/hooks/use-fade-in';

export function ContactPage() {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div
          ref={ref}
          style={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
        >
          {/* Left — intro text */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl lg:text-6xl text-espresso leading-tight mb-8">
              Tell us about your celebration.
            </h1>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              Whether you are planning a wedding, a milestone birthday, or simply want a beautiful
              cake for a weekend gathering — we would love to hear from you.
            </p>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              Fill in the form and we will get back to you within 48 hours. For seasonal
              availability, we recommend reaching out at least six weeks in advance.
            </p>

            <div className="mt-10 space-y-4 border-t border-espresso/10 pt-8">
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  Response Time
                </p>
                <p className="font-sans text-sm text-espresso/70">Within 48 hours</p>
              </div>
              <div>
                <p className="font-sans text-xs font-medium tracking-widest uppercase text-espresso/40 mb-1">
                  Lead Time
                </p>
                <p className="font-sans text-sm text-espresso/70">
                  Minimum 6 weeks for custom orders
                </p>
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
