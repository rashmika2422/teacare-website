'use client';
import { useRef } from 'react';
import { useScrollReveal, revealStyle, SectionHeading } from './AnimUtils';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="advanced-grid-lines" />
      <div className="advanced-bg-overlay" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <SectionHeading
          subtitle="Who We Are"
          title="Corporate Hospitality"
          goldText="Engineered to Perfection"
          light
        />

        <div className="grid-2">
          <div className="about-canvas-box" data-reveal style={revealStyle(0.15)}>
            <div className="canvas-underlay" />
            <div className="geometric-ring ring-gold" style={{ top: '-30px', left: '-30px' }} />
            <div className="geometric-ring ring-purple" style={{ bottom: '-20px', right: '40px' }} />
            <div className="canvas-image-primary" style={{ backgroundImage: "url('/assets/images/image01.JPG')" }} />
            <div className="canvas-image-secondary" style={{ backgroundImage: "url('/assets/images/81d1430d-132a-4f3b-8793-7b4d11166e06.JPG')" }} />
            <div className="canvas-badge-floating">
              <i className="fa-solid fa-certificate" style={{ marginRight: '6px' }} /> Premium Certified
            </div>
          </div>

          <div className="about-text-content">
            <h3 data-reveal style={revealStyle(0.2)}>Elevating Hospitality Standards For High-End Enterprise Events</h3>
            <p className="about-description" data-reveal style={revealStyle(0.3)}>
              At <strong>Teacare Servicess Pvt Ltd</strong>, we understand that an institutional gathering or cooperative milestone is a direct extension of your corporate market reputation.
            </p>
            <p className="about-description" data-reveal style={revealStyle(0.35)}>
              Whether managing a sophisticated executive high tea session for international shareholders or arranging a sprawling, top-tier corporate buffet menu for thousands of delegates, our dedicated team ensures your event flows flawlessly.
            </p>
            <div className="about-value-grid" data-reveal style={revealStyle(0.4)}>
              {[
                { icon: 'fa-clock-rotate-left', title: 'Punctual Transitions', desc: 'Minute-by-minute execution designed around high-stakes corporate agendas.' },
                { icon: 'fa-crown', title: 'Artisanal Assets', desc: 'Fine porcelain layouts and bespoke floral designs matching corporate themes.' },
                { icon: 'fa-medal', title: 'Executive Standards', desc: 'Sommelier-level beverage service and professional delegate hospitality.' },
              ].map(v => (
                <div key={v.title} className="value-chip">
                  <div className="chip-icon"><i className={`fa-solid ${v.icon}`} /></div>
                  <h5>{v.title}</h5>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
            <div className="about-actions" data-reveal style={{ ...revealStyle(0.5), marginTop: '30px' }}>
              <a href="#contact-us" className="cta-btn primary" style={{ background: 'linear-gradient(135deg,#f39c12,#e67e22)', color: '#1a202c', textDecoration: 'none' }}>
                Schedule Design Briefing <i className="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
