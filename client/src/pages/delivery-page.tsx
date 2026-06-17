import { useT } from '@/i18n';
import { useFadeIn } from '@/hooks/use-fade-in';

export function DeliveryPage() {
  const t = useT();
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <div ref={ref} className="max-w-3xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="font-display text-4xl lg:text-5xl text-espresso mb-4">
          {t.legal.delivery.title}
        </h1>
        <p className="font-sans text-sm text-espresso/40 mb-12">Last updated: June 2026</p>

        <div className="space-y-8 font-sans text-espresso/70 leading-relaxed text-base">
          <Section title="Delivery">
            <p>
              We offer delivery to addresses within the city. The delivery fee and any minimum order
              requirements are shown at checkout and can be configured by the bakery.
            </p>
            <p>
              Deliveries are made on the date and within the time slot selected at checkout. Please
              ensure someone is available to receive the order.
            </p>
            <p>
              Fresh products are temperature-sensitive. We do our best to deliver on time; however,
              we cannot accept returns on perishable goods that have been delivered correctly.
            </p>
          </Section>

          <Section title="Pickup">
            <p>
              You may collect your order from any of our branch locations. Please select your
              preferred branch and time slot at checkout.
            </p>
            <p>Bring your order confirmation email or order reference number when collecting.</p>
          </Section>

          <Section title="Lead Times">
            <p>
              Most products are available on the same day if ordered before the daily cutoff time.
              Custom and bespoke cakes require a minimum of 6 weeks lead time.
            </p>
          </Section>

          <Section title="Returns & Refunds">
            <p>
              Due to the perishable nature of our products, we are unable to accept returns on
              delivered or collected orders unless there is a quality issue.
            </p>
            <p>
              If you receive an order that does not meet our quality standards, please contact us
              within 24 hours of receipt with a photograph and description of the issue. We will
              offer a replacement or full refund at our discretion.
            </p>
            <p>
              Order cancellations may be made up to 48 hours before the scheduled delivery or pickup
              time. After this point, a cancellation fee may apply.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For questions about an order, please use our{' '}
              <a href="/contact" className="text-rose hover:text-rose-dark">
                Contact page
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-espresso mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
