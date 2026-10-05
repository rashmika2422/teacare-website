'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const milestones = [
  { year: '2018', title: 'Founded in Colombo', desc: 'Started with bespoke Ceylon high tea catering for boutique corporate forums.' },
  { year: '2021', title: 'Enterprise Expansion', desc: 'Scaled operations to manage 500+ delegate B2B summits and annual shareholder galas.' },
  { year: '2024', title: 'National Recognition', desc: 'Certified as Sri Lanka premier corporate hospitality & event logistics provider.' }
];

export default function AboutPage() {
  const [activeStory, setActiveStory] = useState(0);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark-gray)', color: '#ffffff', fontFamily: 'Poppins, sans-serif' }}>
      <Header />
      
      {/* Hero Header */}
      <section className="about-hero" style={{
        position: 'relative',
        padding: '160px 8% 100px',
        backgroundImage: 'linear-gradient(180deg, rgba(15,20,28,0.5) 0%, rgba(15,20,28,0.7) 60%, var(--dark-gray) 100%), url("/assets/images/aboutus_background.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderBottom: '1px solid rgba(243,156,18,0.1)'
      }}>
        {/* Back to Home Button */}
        <div className="back-btn-container">
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#a0aec0',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#f39c12';
              e.currentTarget.style.borderColor = '#f39c12';
              e.currentTarget.style.background = 'rgba(243,156,18,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#a0aec0';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </a>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ 
            color: '#f39c12', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', 
            fontSize: '0.85rem', display: 'inline-block', marginBottom: '15px' 
          }}>
            Who We Are
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: '#ffffff', margin: '0 0 25px', lineHeight: 1.1 }}>
            The Story of <br/><span className="gold-gradient-text">Teacare Service PVT LTD</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 300 }}>
            Dedicated to engineering flawless, high-stakes corporate hospitality experiences with Sri Lankan warmth and international precision.
          </p>
        </div>
      </section>

      {/* Two Column Canvas Story */}
      <section style={{ padding: '100px 8%', maxWidth: '1300px', margin: '0 auto' }}>
        <div className="about-canvas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          {/* Left Canvas with local user photos/videos */}
          <div className="about-canvas-wrapper" style={{ position: 'relative', minHeight: '500px' }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80%',
              height: '400px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 1
            }}>
              <video 
                autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src="/assets/images/aboutus.MP4" type="video/mp4" />
              </video>
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '65%',
              height: '300px',
              borderRadius: '16px',
              backgroundImage: "url('/assets/images/030ceddc-631b-4234-a761-cf915d107809.JPG')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
              border: '6px solid #0f141c',
              zIndex: 2
            }} />
          </div>

          {/* Right Text */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', color: '#ffffff', marginBottom: '25px', lineHeight: 1.2 }}>
              Precision Hospitality <span className="gold-gradient-text">Engineered for Royalty &amp; C-Suites</span>
            </h2>
            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #f39c12, #e67e22)', marginBottom: '30px', borderRadius: '2px' }} />
            
            <p style={{ color: '#a0aec0', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '25px' }}>
              At <strong style={{ color: '#fff' }}>Teacare Service PVT LTD Pvt Ltd</strong>, we treat every corporate event as a vital milestone. From high-stakes board room meetings to multi-day summits, our team combines Sommelier-grade tea selection with international protocol standards.
            </p>
            <p style={{ color: '#a0aec0', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '40px' }}>
              Our commitment goes beyond catering; it's about curating an atmosphere that reflects your brand's prestige and values, ensuring every delegate leaves with a lasting impression of excellence.
            </p>
            
            <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#1a202c', padding: '25px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #f39c12', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                <h4 style={{ color: '#f39c12', fontSize: '2rem', fontFamily: 'Playfair Display, serif', margin: '0 0 5px' }}>99.8%</h4>
                <span style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>Punctuality &amp; Execution</span>
              </div>
              <div style={{ background: '#1a202c', padding: '25px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #6c5ce7', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                <h4 style={{ color: '#6c5ce7', fontSize: '2rem', fontFamily: 'Playfair Display, serif', margin: '0 0 5px' }}>150+</h4>
                <span style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Galas Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Milestones Timeline */}
      <section style={{ padding: '100px 8%', background: '#090d14', borderTop: '1px solid rgba(255,255,255,0.02)', paddingBottom: '140px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#f39c12', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '15px' }}>
            Our Journey
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', color: '#ffffff', marginBottom: '50px' }}>
            Corporate <span className="gold-gradient-text">Growth Milestones</span>
          </h2>
          <div className="about-milestones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {milestones.map((m, i) => (
              <div
                key={i}
                onClick={() => setActiveStory(i)}
                style={{
                  background: activeStory === i ? '#1a202c' : 'rgba(255,255,255,0.02)',
                  padding: '40px 30px',
                  borderRadius: '16px',
                  border: activeStory === i ? '1px solid #f39c12' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: activeStory === i ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: activeStory === i ? '0 15px 30px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: activeStory===i ? '#f39c12' : '#4a5568', fontFamily: 'Playfair Display, serif', display: 'block', marginBottom: '15px', transition: 'color 0.3s' }}>{m.year}</span>
                <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 10px' }}>{m.title}</h4>
                <p style={{ color: '#a0aec0', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Crew Section */}
      <section style={{ padding: '80px 8% 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#f39c12', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '15px' }}>
            The Backbone of Teacare
          </span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', color: '#ffffff' }}>
            Meet <span className="gold-gradient-text">Our Crew</span>
          </h2>
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #f39c12, #e67e22)', margin: '20px auto 0', borderRadius: '2px' }} />
          <p style={{ color: '#a0aec0', fontSize: '1.05rem', maxWidth: '700px', margin: '25px auto 0', lineHeight: 1.6 }}>
            Our dedicated team of event executives, sommeliers, and production specialists who work tirelessly behind the scenes to engineer flawless corporate experiences.
          </p>
        </div>

        <div className="crew-image-box" style={{
          position: 'relative',
          width: '100%',
          height: '550px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          const img = e.currentTarget.querySelector('.crew-bg') as HTMLElement;
          const overlay = e.currentTarget.querySelector('.crew-overlay') as HTMLElement;
          if (img) img.style.transform = 'scale(1.05)';
          if (overlay) overlay.style.background = 'linear-gradient(180deg, rgba(15,20,28,0.1) 0%, rgba(243,156,18,0.4) 100%)';
        }}
        onMouseOut={(e) => {
          const img = e.currentTarget.querySelector('.crew-bg') as HTMLElement;
          const overlay = e.currentTarget.querySelector('.crew-overlay') as HTMLElement;
          if (img) img.style.transform = 'scale(1)';
          if (overlay) overlay.style.background = 'linear-gradient(180deg, rgba(15,20,28,0) 0%, rgba(15,20,28,0.9) 100%)';
        }}>
          {/* Replace this filename with the exact crew image filename if it differs */}
          <div className="crew-bg" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: "url('/assets/images/afdfa8a8-374f-4b83-988f-a1491541f808.JPG')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
          <div className="crew-overlay" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(180deg, rgba(15,20,28,0) 0%, rgba(15,20,28,0.9) 100%)',
            transition: 'background 0.5s ease',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            position: 'absolute', bottom: '40px', left: '40px',
            pointerEvents: 'none'
          }}>
            <h3 style={{ color: '#fff', fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', margin: 0, textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
              Teacare Operational Team
            </h3>
            <p style={{ color: '#f39c12', fontWeight: 600, margin: '5px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              The Engine of Excellence
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
