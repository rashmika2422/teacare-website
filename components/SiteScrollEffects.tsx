'use client';

import { useEffect } from 'react';

const revealSelector = '[data-aos]';

export default function SiteScrollEffects() {
  useEffect(() => {
    if (
      window.location.pathname.startsWith('/admin') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const observedElements = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-site-aos-visible', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );

    const observeElements = (root: ParentNode) => {
      if (root instanceof Element && root.matches(revealSelector)) {
        if (!observedElements.has(root)) {
          observedElements.add(root);
          observer.observe(root);
        }
      }

      root.querySelectorAll(revealSelector).forEach((element) => {
        if (!observedElements.has(element)) {
          observedElements.add(element);
          observer.observe(element);
        }
      });
    };

    document.documentElement.classList.add('site-motion-ready');
    observeElements(document);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeElements(node);
        });
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      document.documentElement.classList.remove('site-motion-ready');
    };
  }, []);

  return null;
}
