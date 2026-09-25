'use client';
import { useEffect, useRef } from 'react';

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll<HTMLElement>('.testimonial-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, i * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const reviews = [
    { name: 'Jonathan Hayes', role: 'CEO, Apex Financial', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop', text: '"The level of precision and elegance they brought to our annual shareholder gala was unmatched. They handled the massive scale of our event with absolute perfection."' },
    { name: 'Sarah Lin', role: 'Director, Global Tech', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop', text: '"From the custom menu design to the seamless logistics, our international summit was executed flawlessly. An indispensable partner for high-level corporate hosting."' },
    { name: 'Marcus Vance', role: 'COO, Vanguard Media', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop', text: '"They transformed a standard corporate presentation into an immersive, premium experience. Our board of directors was thoroughly impressed."' },
  ];

  return (
    <section id="testimonials" className="client-testimonials">
      <div className="ambient-glow glow-3" style={{ top: '-100px', left: '-200px' }} />
      <div className="testimonial-header">
        <h2>Trusted By <span className="gold-gradient-text">Industry Leaders</span></h2>
        <div className="gold-divider" />
        <p>Our commitment to flawless execution has made us the premier choice for enterprise hospitality.</p>
      </div>
      <div ref={gridRef} className="testimonial-grid">
        {reviews.map((r, i) => (
          <div key={r.name} className="testimonial-card" style={{ opacity: 0, transform: 'translateY(30px) scale(0.95)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s` }}>
            <div className="stars">
              {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star" />)}
            </div>
            <p className="review-text">{r.text}</p>
            <div className="executive-profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt={r.name} className="executive-img" />
              <div className="executive-info">
                <h4>{r.name}</h4>
                <span>{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
