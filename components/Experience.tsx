'use client';
import { useRef } from 'react';
import { useScrollReveal, revealStyle, SectionHeading } from './AnimUtils';

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef, 0.02);

  // Animate counters + bars
  useScrollReveal(statsRef, 0.3);

  return (
    <section ref={sectionRef} id="experience" className="experience-section">
      <div className="ambient-glow glow-2" style={{ top: '-200px', right: '-200px' }} />
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center' }}>
            <div data-reveal className="hover-scale-container" style={{
              ...revealStyle(0.1),
              width: '100%', height: '480px', borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(243,156,18,0.2), transparent)', zIndex: 1 }} />
              <img 
                src="/assets/images/catering_showcase_custom.jpg" 
                alt="Five-Star Executive Banquet" 
                className="hover-scale-img"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  opacity: 0.9, transition: 'transform 0.8s ease'
                }} 
              />
            </div>
          </div>

          <div className="exp-text exp-text-col">
            <span style={{
              color: '#f39c12', fontWeight: 700, textTransform: 'uppercase' as const,
              letterSpacing: '3px', fontSize: '0.82rem', display: 'inline-flex',
              alignItems: 'center', gap: '8px', marginBottom: '14px'
            }}>
              <span style={{ width: '25px', height: '2px', background: '#f39c12', display: 'inline-block' }} />
              Why Choose Us
            </span>
            <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '20px', lineHeight: 1.2 }}>
              Uncompromising Standards For <span className="gold-gradient-text">Major Enterprises</span>
            </h2>
            <p className="exp-desc">
              We understand that a corporate gathering is a direct extension of your company&apos;s market reputation. Our elite planning system guarantees pinpoint execution, breathtaking culinary presentations, and a welcoming aura.
            </p>
            <div ref={statsRef} className="stats-dashboard">
              {[
                { num: '99.8%', label: 'Punctuality Score', w: '99.8%' },
                { num: '150+', label: 'Enterprise Galas', w: '85%' },
                { num: '5-Star', label: 'Culinary Standard', w: '100%' },
              ].map((s, i) => (
                <div key={s.label} className="stat-card" data-reveal style={revealStyle(0.3 + i * 0.12)}>
                  <div className="stat-num gold-gradient-text">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-track"><div className="stat-fill" style={{ width: s.w }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
