import { useFadeIn } from '@/hooks/use-fade-in';
import { Link } from 'react-router-dom';

const values = [
  {
    title: 'Made from scratch, always.',
    body: 'Every sponge, every buttercream, every sugar flower. No shortcuts, no compromises.',
  },
  {
    title: 'Seasonal by instinct.',
    body: 'We follow the seasons for fruit, flavour, and inspiration. What is ripe right now is what tastes best.',
  },
  {
    title: 'One order at a time.',
    body: 'Each cake receives our full attention. We limit how many we take on each week so nothing is ever rushed.',
  },
  {
    title: 'Beauty that is also delicious.',
    body: 'A cake that looks stunning but tastes underwhelming is a missed opportunity. We refuse to choose.',
  },
];

export function AboutPage() {
  const storyRef = useFadeIn<HTMLDivElement>();
  const valuesRef = useFadeIn<HTMLDivElement>();
  const imageRef = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-36 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={storyRef} style={{ opacity: 0 }}>
            <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-4">
              Our Story
            </p>
            <h1 className="font-display text-5xl lg:text-6xl text-espresso leading-tight mb-8">
              Baked with patience. Designed with care.
            </h1>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              Slice began in a small kitchen with one goal: make cakes worth celebrating. Not just
              visually striking, but genuinely delicious — the kind people talk about for years.
            </p>
            <p className="font-sans text-base text-espresso/60 leading-relaxed mb-5">
              Every recipe has been developed over dozens of test batches. Every design starts with
              a conversation about you, your event, and what you love.
            </p>
            <p className="font-sans text-base text-espresso/60 leading-relaxed">
              We are a small, deliberately slow operation. That is not a limitation — it is the
              whole point.
            </p>
          </div>

          <div
            ref={imageRef}
            style={{ opacity: 0 }}
            className="aspect-[3/4] overflow-hidden bg-cream"
          >
            <img
              src="https://picsum.photos/seed/about-baker/600/800"
              alt="Our baker at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div ref={valuesRef} style={{ opacity: 0 }}>
            <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-3">
              What We Believe
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-espresso mb-16">Our values</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
              {values.map(({ title, body }) => (
                <div key={title} className="border-t border-espresso/12 pt-6">
                  <h3 className="font-display text-xl text-espresso mb-3">{title}</h3>
                  <p className="font-sans text-sm text-espresso/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h2 className="font-display text-4xl lg:text-5xl text-espresso mb-4">
          Let us make something together.
        </h2>
        <p className="font-sans text-base text-espresso/60 max-w-sm mx-auto leading-relaxed mb-8">
          Whether you have a vision or just a date, we are here to help.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-rose text-white text-sm font-sans font-medium tracking-wide hover:bg-rose-dark transition-colors"
        >
          Start a Conversation
        </Link>
      </section>
    </main>
  );
}
