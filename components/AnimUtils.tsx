'use client';
import { useEffect, useRef, type RefObject } from 'react';

/** Observes a container and animates all [data-reveal] children with staggered delays */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, threshold = 0.12) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const els = entry.target.querySelectorAll<HTMLElement>('[data-reveal]');
          els.forEach((el, i) => {
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
}

/** Returns inline style for reveal-ready elements */
export function revealStyle(delay = 0): React.CSSProperties {
  return {
    opacity: 0,
    transform: 'translateY(60px) scale(0.92) rotateX(-15deg)',
    transition: `all 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`
  };
}

/** Animated section heading component */
export function SectionHeading({ subtitle, title, goldText, description, light = false }: {
  subtitle?: string; title: string; goldText: string; description?: string; light?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <div ref={ref} style={{ textAlign: 'center', marginBottom: '55px', position: 'relative', zIndex: 2 }}>
      {subtitle && (
        <span data-reveal style={{
          ...revealStyle(0),
          color: '#f39c12', fontWeight: 700, textTransform: 'uppercase' as const,
          letterSpacing: '3px', fontSize: '0.82rem', display: 'inline-flex',
          alignItems: 'center', gap: '10px', marginBottom: '14px',
          background: light ? 'rgba(243,156,18,0.08)' : 'rgba(243,156,18,0.06)',
          padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(243,156,18,0.15)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f39c12', boxShadow: '0 0 10px #f39c12' }} />
          {subtitle}
        </span>
      )}
      <h2 data-reveal style={{
        ...revealStyle(0.1),
        fontSize: '2.6rem', fontFamily: 'Playfair Display, serif',
        color: light ? '#1a202c' : '#fff', margin: '12px 0', lineHeight: 1.2
      }}>
        {title} <span className="gold-gradient-text">{goldText}</span>
      </h2>
      <div data-reveal style={{
        ...revealStyle(0.2),
        width: '50px', height: '3px',
        background: 'linear-gradient(90deg, #f39c12, #e67e22)',
        margin: '0 auto 14px', borderRadius: '2px'
      }} />
      {description && (
        <p data-reveal style={{
          ...revealStyle(0.25),
          color: light ? '#4a5568' : '#a0aec0', fontSize: '1.05rem',
          maxWidth: '650px', margin: '0 auto'
        }}>
          {description}
        </p>
      )}
    </div>
  );
}
