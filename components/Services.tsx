'use client';
import { useState, useEffect, useRef } from 'react';
import { SectionHeading, useScrollReveal, revealStyle } from './AnimUtils';

interface ServiceItem { id: string; icon: string; title: string; desc: string; highlights: string[]; }

const serviceDetails: ServiceItem[] = [
  { id: 'tea', icon: 'fa-mug-hot', title: 'Executive High Tea', desc: 'Curated premier tea blends, delicate porcelain styling, and fine pastries for high-tier networking intervals.', highlights: ['Single-Origin Ceylon Teas', 'Bespoke Porcelain Layouts', 'Artisanal Pastry Platters', 'Dedicated Tea Sommelier'] },
  { id: 'buffet', icon: 'fa-utensils', title: 'Corporate Buffets', desc: 'Lavish culinary experiences engineered to suit vast global palates with pristine aesthetic setups.', highlights: ['Multi-Cuisine Selection', 'Live Chef Stations', 'Elegantly Plated Canapés', 'VIP Delegate Service'] },
  { id: 'production', icon: 'fa-display', title: 'Presentation Production', desc: 'Flawless catering, crystal-clear acoustics, and visual arrangements for key corporate launches.', highlights: ['Full Stage & Lighting Rig', 'High-Fidelity Audio Setup', 'Press Lounge Hospitality', 'Seamless Brand Alignment'] },
  { id: 'summit', icon: 'fa-building-columns', title: 'Cooperative Summits', desc: 'Flawless management of inter-company forums and national conferences around your objectives.', highlights: ['Keynote Stage Logistics', 'Breakout Refreshment Stations', 'Multilingual Hostesses', 'End-to-End Floor Protocol'] }
];

const showcaseMedia = [
  { type: 'video', src: '/assets/images/40d96993-43d0-469b-bc51-255eca92b458.MP4', title: 'Gala Night Setup' },
  { type: 'image', src: '/assets/images/4c05f57e-6687-4069-9da0-75bd387b31d0.JPG', title: 'Executive Table Arrangements' },
  { type: 'image', src: '/assets/images/3150f07e-2b62-4fb1-a3ce-08c352256f86.JPG', title: 'Premium Catering Display' },
  { type: 'image', src: '/assets/images/33471c52-5a9a-4ee4-984a-4caeec62e50f.JPG', title: 'VIP Networking Lounge' },
  { type: 'image', src: '/assets/images/4dd8d992-a640-44ba-9f23-fb03abeea95e.JPG', title: 'Bespoke Dessert Station' },
  { type: 'image', src: '/assets/images/78d6eb67-1dde-4625-b99f-8c1fe0930372.JPG', title: 'Summit Conference Hall' },
  { type: 'image', src: '/assets/images/81d1430d-132a-4f3b-8793-7b4d11166e06.JPG', title: 'Artisanal Canapés' },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modalAnim, setModalAnim] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const mediaGridRef = useRef<HTMLDivElement>(null);

  useScrollReveal(mediaGridRef);

  const closeModal = () => { setModalAnim(false); setTimeout(() => setSelectedService(null), 300); };
  const openModal = (s: ServiceItem) => { setSelectedService(s); requestAnimationFrame(() => setModalAnim(true)); };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll<HTMLElement>('.service-card');
          cards.forEach((card, i) => { setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 150); });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

    const [showAllMedia, setShowAllMedia] = useState(false);
    const displayedMedia = showAllMedia ? showcaseMedia : showcaseMedia.slice(0, 6);

    return (
    <section id="services" className="services-section">
      <div className="ambient-glow glow-2" style={{ bottom: '-200px', left: '-250px' }} />
      <SectionHeading subtitle="What We Offer" title="Our Specialized" goldText="Service Verticals" description="Masterfully tailored for professional settings and key corporate milestones" />

      <div ref={gridRef} className="services-grid" style={{ marginBottom: '80px' }}>
        {serviceDetails.map((service) => (
          <div key={service.id} className="service-card" onClick={() => openModal(service)}
            style={{ cursor: 'pointer', opacity: 0, transform: 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
            <div className="icon-box"><i className={`fa-solid ${service.icon}`} /></div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '15px', fontSize: '0.85rem', color: '#f39c12', fontWeight: 700 }}>
              Explore Specifications <i className="fa-solid fa-arrow-right" />
            </span>
          </div>
        ))}
      </div>

      {/* New Media Showcase Section beneath Services */}
      <div ref={mediaGridRef} className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <SectionHeading subtitle="Visual Excellence" title="Our Signature" goldText="Event Environments" description="A glimpse into the atmosphere and precision we engineer for every corporate occasion." />
        
        <div className="media-showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '40px' }}>
          {displayedMedia.map((media, i) => (
            <div key={i} data-reveal style={{ 
              ...revealStyle(i * 0.15), 
              position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden', 
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer' 
            }}
            onMouseOver={(e) => {
              const img = e.currentTarget.querySelector('.media-bg') as HTMLElement;
              const overlay = e.currentTarget.querySelector('.media-overlay') as HTMLElement;
              const text = e.currentTarget.querySelector('.media-text') as HTMLElement;
              if (img) img.style.transform = 'scale(1.08)';
              if (overlay) overlay.style.background = 'linear-gradient(180deg, rgba(15,20,28,0.1) 0%, rgba(243,156,18,0.75) 100%)';
              if (text) text.style.transform = 'translateY(0)';
            }}
            onMouseOut={(e) => {
              const img = e.currentTarget.querySelector('.media-bg') as HTMLElement;
              const overlay = e.currentTarget.querySelector('.media-overlay') as HTMLElement;
              const text = e.currentTarget.querySelector('.media-text') as HTMLElement;
              if (img) img.style.transform = 'scale(1)';
              if (overlay) overlay.style.background = 'linear-gradient(180deg, rgba(15,20,28,0) 0%, rgba(15,20,28,0.9) 100%)';
              if (text) text.style.transform = 'translateY(10px)';
            }}>
              {media.type === 'video' ? (
                <video 
                  className="media-bg" autoPlay loop muted playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <source src={media.src} type="video/mp4" />
                </video>
              ) : (
                <div className="media-bg" style={{ 
                  width: '100%', height: '100%', backgroundImage: `url('${media.src}')`, 
                  backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' 
                }} />
              )}
              <div className="media-overlay" style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                background: 'linear-gradient(180deg, rgba(15,20,28,0) 0%, rgba(15,20,28,0.9) 100%)', 
                transition: 'background 0.4s ease', pointerEvents: 'none' 
              }} />
              <div style={{ position: 'absolute', bottom: '25px', left: '25px', right: '25px', pointerEvents: 'none' }}>
                <h4 className="media-text" style={{ 
                  color: '#fff', fontSize: '1.25rem', fontFamily: 'Playfair Display, serif', 
                  margin: 0, transform: 'translateY(10px)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>{media.title}</h4>
              </div>
            </div>
          ))}
        </div>
        
        {showcaseMedia.length > 6 && (
          <div data-reveal style={{ textAlign: 'center', marginTop: '50px', paddingBottom: '20px', width: '100%', ...revealStyle(0.2) }}>
            <button onClick={() => setShowAllMedia(!showAllMedia)} className="cta-btn secondary" style={{
              background: 'transparent', border: '1px solid rgba(243,156,18,0.5)', color: '#f39c12',
              padding: '12px 30px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem',
              fontWeight: 600, transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(243,156,18,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              {showAllMedia ? 'Show Less' : 'See All Environments'} <i className={`fa-solid fa-chevron-${showAllMedia ? 'up' : 'down'}`} />
            </button>
          </div>
        )}
      </div>

      {selectedService && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: modalAnim ? 'rgba(15,20,28,0.85)' : 'rgba(15,20,28,0)', backdropFilter: modalAnim ? 'blur(12px)' : 'blur(0px)', WebkitBackdropFilter: modalAnim ? 'blur(12px)' : 'blur(0px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', transition: 'all 0.3s ease' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#1a202c', border: '1px solid rgba(243,156,18,0.4)', borderRadius: '16px', padding: '40px', maxWidth: '550px', width: '100%', color: '#ffffff', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', transform: modalAnim ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)', opacity: modalAnim ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#a0aec0', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg,#f39c12,#e67e22)', color: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '20px' }}>
              <i className={`fa-solid ${selectedService.icon}`} />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', color: '#f39c12', marginBottom: '10px' }}>{selectedService.title}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px' }}>{selectedService.desc}</p>
            <h4 style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Included Premium Highlights</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
              {selectedService.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#edf2f7' }}>
                  <span style={{ color: '#2ecc71' }}>✓</span> {h}
                </div>
              ))}
            </div>
            <a href="#appointment" onClick={closeModal} className="cta-btn primary" style={{ display: 'block', textAlign: 'center', borderRadius: '8px', background: 'linear-gradient(135deg,#f39c12,#e67e22)', color: '#1a202c', textDecoration: 'none' }}>
              Book Consultation <i className="fa-solid fa-calendar-plus" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
