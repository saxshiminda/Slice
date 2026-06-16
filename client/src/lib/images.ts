/** Local image paths served from client/public — no external hotlinks. */
export const SITE_IMAGES = {
  hero: '/images/site/hero.jpg',
  inspo: '/images/site/inspo.jpg',
  aboutBaker: '/images/site/about-baker.jpg',
  gallerySlices: '/images/site/gallery-slices.jpg',
} as const;

export function cakeImagePath(slug: string): string {
  return `/images/cakes/${slug}.jpg`;
}
