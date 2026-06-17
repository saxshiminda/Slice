/** Local image paths served from client/public — no external hotlinks. */
export const SITE_IMAGES = {
  hero: '/images/site/hero.jpg',
  inspo: '/images/site/inspo.jpg',
  aboutBaker: '/images/site/about-baker.jpg',
  gallerySlices: '/images/site/gallery-slices.jpg',
} as const;

export const CAKE_IMAGES = [
  { slug: 'grand-ivory-wedding', label: 'Grand Ivory Wedding' },
  { slug: 'blush-peony-wedding', label: 'Blush Peony Wedding' },
  { slug: 'golden-birthday-celebration', label: 'Golden Birthday' },
  { slug: 'whimsical-rainbow-smash', label: 'Rainbow Smash' },
  { slug: 'autumn-spiced-harvest', label: 'Autumn Harvest' },
  { slug: 'strawberry-midsummer', label: 'Strawberry Midsummer' },
  { slug: 'bespoke-portrait-cake', label: 'Bespoke Portrait' },
  { slug: 'floral-cascade-custom', label: 'Floral Cascade' },
  { slug: 'winter-spice-wedding', label: 'Winter Spice Wedding' },
] as const;

export function cakeImagePath(slug: string): string {
  return `/images/cakes/${slug}.jpg`;
}

/** Resolve a stored imageUrl for use in img src. */
export function resolveImageSrc(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const api = import.meta.env['VITE_API_URL'] ?? '';
  if (url.startsWith('/uploads') && api) return `${api}${url}`;
  return url;
}
