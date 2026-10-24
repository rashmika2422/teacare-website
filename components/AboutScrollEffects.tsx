'use client';

import { useEffect } from 'react';

export default function AboutScrollEffects() {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>('.about-page');
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
    container.classList.add('about-page-motion-ready');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return () => container.classList.remove('about-page-motion-ready');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      container.classList.remove('about-page-motion-ready');
    };
  }, []);

  return null;
}
