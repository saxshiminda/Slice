#!/usr/bin/env sh
# Downloads cake and site images into client/public/images/.
# Run once after clone, or when refreshing assets from Unsplash sources.

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CAKES="$ROOT/client/public/images/cakes"
SITE="$ROOT/client/public/images/site"

mkdir -p "$CAKES" "$SITE"

download() {
  url="$1"
  out="$2"
  echo "→ $out"
  curl -fsSL "$url" -o "$out"
}

# Cake thumbnails (800×600)
download "https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/grand-ivory-wedding.jpg"
download "https://images.unsplash.com/photo-1622621746668-59fb299bc4d7?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/blush-peony-wedding.jpg"
download "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/golden-birthday-celebration.jpg"
download "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/whimsical-rainbow-smash.jpg"
download "https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/autumn-spiced-harvest.jpg"
download "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/strawberry-midsummer.jpg"
download "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/bespoke-portrait-cake.jpg"
download "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/floral-cascade-custom.jpg"
download "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&h=600&q=80" "$CAKES/winter-spice-wedding.jpg"

# Site hero bands (1600×900)
download "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&h=900&q=80" "$SITE/hero.jpg"
download "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&h=900&q=80" "$SITE/inspo.jpg"
download "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=600&h=800&q=80" "$SITE/about-baker.jpg"
download "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&h=400&q=80" "$SITE/gallery-slices.jpg"

echo "Done. Images saved to client/public/images/"
