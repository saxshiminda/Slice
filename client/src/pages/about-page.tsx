import { useFadeIn } from '@/hooks/use-fade-in';
import { Link } from 'react-router-dom';

const UNSPLASH = (id: string, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const values = [
  {
    title: 'Made from scratch, always.',
    body: 'Every sponge, every buttercream, every sugar flower. No shortcuts, no compromises.',
    color: 'border-rose',
  },
  {
    title: 'Seasonal by instinct.',
    body: 'We follow the seasons for fruit, flavour, and inspiration. What is ripe right now is what tastes best.',
    color: 'border-sage',
  },
  {
    title: 'One order at a time.',
    body: 'Each cake receives our full attention. We limit how many we take on each week so nothing is ever rushed.',
    color: 'border-rose',
  },
  {
    title: 'Beauty that is also delicious.',
    body: 'A cake that looks stunning but tastes underwhelming is a missed opportunity. We refuse to choose.',
    color: 'border-sage',
  },
];

export function AboutPage() {
  const storyRef = useFadeIn<HTMLDivElement>();
  const valuesRef = useFadeIn<HTMLDivElement>();
  const imageRef = useFadeIn<HTMLDivElement>();
  const galleryRef = useFadeIn<HTMLDivElement>();

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={storyRef} style={{ opacity: 0 }}>
            <p className="font-sans text-xs tracking-widest uppercase text-rose mb-4">Our Story</p>
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
              src={UNSPLASH('1551106652-a5bcf4b29ab6')}
              alt="Our baker at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-espresso">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div ref={valuesRef} style={{ opacity: 0 }}>
            <p className="font-sans text-xs tracking-widest uppercase text-rose mb-3">
              What We Believe
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-warm mb-16">Our values</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              {values.map(({ title, body, color }) => (
                <div key={title} className={`border-t-2 ${color} pt-6`}>
                  <h3 className="font-display text-xl text-warm mb-3">{title}</h3>
                  <p className="font-sans text-sm text-warm/50 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-20 lg:py-28 bg-cream">
        <div ref={galleryRef} style={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="font-sans text-xs tracking-widest uppercase text-espresso/40 mb-10 text-center">
            From the Studio
          </p>
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            <div className="aspect-square overflow-hidden">
              <img
                src={UNSPLASH('1535141192574-5d4897c12636', 400, 400)}
                alt="Cake detail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src={UNSPLASH('1571115177098-24ec42ed204d', 400, 400)}
                alt="Floral cake"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src={UNSPLASH('1565958011703-44f9829ba187', 400, 400)}
                alt="Cake slices"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose py-20 lg:py-28 px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl lg:text-5xl text-white mb-4">
          Let us make something together.
        </h2>
        <p className="font-sans text-base text-white/75 max-w-sm mx-auto leading-relaxed mb-8">
          Whether you have a vision or just a date, we are here to help.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose text-sm font-sans font-medium tracking-wide hover:bg-cream transition-colors"
        >
          Start a Conversation
        </Link>
      </section>
    </main>
  );
}
