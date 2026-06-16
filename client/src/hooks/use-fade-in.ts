import { useEffect, useRef } from 'react';

export function useFadeIn<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add('opacity-0');

    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      el.classList.remove('opacity-0');
      el.classList.add('fade-in-up-visible');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);

    // Already in viewport after route change — observer may not fire in time
    requestAnimationFrame(() => {
      const { top, bottom, height } = el.getBoundingClientRect();
      if (height <= 0) return;
      const visible = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
      if (visible > 0 && visible / height >= threshold) {
        reveal();
        observer.disconnect();
      }
    });

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
