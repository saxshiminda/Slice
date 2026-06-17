import { useT } from '@/i18n';
import { useFadeIn } from '@/hooks/use-fade-in';

export function PrivacyPage() {
  const t = useT();
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      <div ref={ref} className="max-w-3xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="font-display text-4xl lg:text-5xl text-espresso mb-4">
          {t.legal.privacy.title}
        </h1>
        <p className="font-sans text-sm text-espresso/40 mb-12">Last updated: June 2026</p>

        <div className="prose-content space-y-8 font-sans text-espresso/70 leading-relaxed text-base">
          <Section title="1. Information We Collect">
            <p>
              We collect information you provide directly — such as your name, email address, phone
              number, and delivery address — when you place an order, fill in a contact form, or
              create an account.
            </p>
            <p>
              We also collect order and payment data to fulfil and record your purchases. Payment is
              processed by our payment partner (Bank of Georgia iPay); we do not store card details.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul>
              <li>To process and fulfil your order.</li>
              <li>To send order confirmations and updates.</li>
              <li>To respond to your enquiries.</li>
              <li>To improve our products and services.</li>
            </ul>
          </Section>

          <Section title="3. Sharing of Information">
            <p>
              We do not sell or rent your personal information to third parties. We may share
              information with service providers (e.g. email delivery, payment processing) strictly
              to operate our business.
            </p>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain order and customer data for up to 5 years for legal and accounting purposes.
              You may request deletion of your account data at any time by contacting us.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>
              You have the right to access, correct, or delete the personal data we hold about you.
              To exercise these rights, please contact us at the email listed on our Contact page.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use only essential cookies required to keep your cart contents and language
              preference. We do not use advertising or third-party tracking cookies.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              If you have questions about this policy, please contact us via our{' '}
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
