'use client';

import { useEffect, useRef, useState } from 'react';

const TYPING_PHRASES = [
  'Meticulously Engineered.',
  'Perfectly Executed.',
  'Beautifully Crafted.',
  'Unforgettably Hosted.',
];

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Typewriter State
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingSpeed = isDeleting ? 40 : 80;
    const currentPhrase = TYPING_PHRASES[phraseIndex];

    if (!isDeleting && displayText === currentPhrase) {
      typingSpeed = 2000;

      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((current) =>
        isDeleting
          ? currentPhrase.substring(0, current.length - 1)
          : currentPhrase.substring(0, current.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  useEffect(() => {
    // Staggered entrance animations
    const items = [badgeRef, titleRef, descRef, btnsRef, statsRef];

    items.forEach((ref, i) => {
      const el = ref.current;

      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';

        setTimeout(() => {
          el.style.transition =
            'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';

          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 400 + i * 250);
      }
    });

    // Create dynamic floating particles
    const pc = particlesRef.current;

    if (pc) {
      for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');

        const size = Math.random() * 5 + 2;
        const isLine = Math.random() > 0.7;

        const w = isLine ? Math.random() * 40 + 20 : size;
        const h = isLine ? 1.5 : size;
        const rot = isLine ? Math.random() * 180 : 0;

        span.style.cssText = `
          position:absolute;
          width:${w}px;
          height:${h}px;
          background:${
            Math.random() > 0.4
              ? 'rgba(243,156,18,0.6)'
              : 'rgba(241,196,15,0.4)'
          };
          border-radius:${isLine ? '1px' : '50%'};
          top:${Math.random() * 100}%;
          left:${Math.random() * 100}%;
          box-shadow:0 0 ${size * 4}px rgba(243,156,18,0.3);
          opacity:0;
          pointer-events:none;
          transform:rotate(${rot}deg);
          animation:floatParticle ${
            6 + Math.random() * 10
          }s ${Math.random() * 5}s infinite ease-in-out;
        `;

        pc.appendChild(span);
      }
    }

    // Parallax on mouse move
    const el = contentRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!el) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animate hero stat counters
    const counters =
      document.querySelectorAll<HTMLElement>('.hero-stat-num');

    counters.forEach((counter) => {
      const target = counter.getAttribute('data-target') || '0';

      const num = parseInt(target);
      const duration = 2200;
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        counter.textContent =
          Math.floor(num * eased) +
          (target.includes('+')
            ? '+'
            : target.includes('%')
              ? '%'
              : '');

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      setTimeout(() => {
        requestAnimationFrame(step);
      }, 1800);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        paddingTop: '100px',
      }}
    >
      {/* Multi-layer gray gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',

          background: `
            linear-gradient(
              135deg,
              rgba(15,20,28,0.97) 0%,
              rgba(26,32,44,0.88) 30%,
              rgba(45,55,72,0.7) 55%,
              rgba(26,32,44,0.75) 80%,
              rgba(15,20,28,0.95) 100%
            )
          `,

          zIndex: 1,
        }}
      />

      {/* Top fade band */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '180px',

          background:
            'linear-gradient(180deg, rgba(15,20,28,1) 0%, transparent 100%)',

          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade band */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '220px',

          background:
            'linear-gradient(0deg, rgba(15,20,28,1) 0%, transparent 100%)',

          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Animated golden accent line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '1px',

          background:
            'linear-gradient(90deg, transparent, rgba(243,156,18,0.15), transparent)',

          zIndex: 2,
          pointerEvents: 'none',

          animation: 'shimmer 4s infinite linear',
        }}
      />

      {/* Floating particles */}
      <div
        ref={particlesRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,

          width: '100%',
          height: '100%',

          zIndex: 3,

          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      />

      {/* Ambient glowing orb */}
      <div
        className="ambient-glow"
        style={{
          position: 'absolute',

          top: '-100px',
          right: '-100px',

          width: '500px',
          height: '500px',

          background:
            'radial-gradient(circle, rgba(243,156,18,0.12) 0%, transparent 70%)',

          filter: 'blur(60px)',

          zIndex: 2,

          animation: 'floatOrb1 18s infinite ease-in-out',

          pointerEvents: 'none',
        }}
      />

      {/* Ambient glowing orb */}
      <div
        className="ambient-glow"
        style={{
          position: 'absolute',

          bottom: '50px',
          left: '-150px',

          width: '450px',
          height: '450px',

          background:
            'radial-gradient(circle, rgba(230,126,34,0.1) 0%, transparent 70%)',

          filter: 'blur(60px)',

          zIndex: 2,

          animation: 'floatOrb2 22s infinite ease-in-out',

          pointerEvents: 'none',
        }}
      />

      {/* Main Hero Content */}
      <div
        ref={contentRef}
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 5,

          maxWidth: '850px',

          padding: '0 25px',

          color: '#ffffff',
        }}
      >
        {/* SEO-friendly badge */}
        <div
          ref={badgeRef}
          style={{
            color: '#f39c12',

            fontWeight: 700,

            letterSpacing: '3px',

            display: 'inline-flex',

            alignItems: 'center',

            gap: '10px',

            marginBottom: '22px',

            textTransform: 'uppercase',

            fontSize: '0.85rem',

            background: 'rgba(243,156,18,0.08)',

            padding: '10px 20px',

            borderRadius: '30px',

            border: '1px solid rgba(243,156,18,0.2)',

            width: 'fit-content',

            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              flexShrink: 0,

              width: '8px',
              height: '8px',

              borderRadius: '50%',

              background: '#f39c12',

              boxShadow: '0 0 12px #f39c12',

              animation: 'goldPulse 2s infinite',
            }}
          />

          CORPORATE EVENT PLANNING &amp; HOSPITALITY • SRI LANKA
        </div>

        {/* Main SEO H1 */}
        <h1
          ref={titleRef}
          style={{
            color: '#ffffff',

            fontSize: '3.6rem',

            fontFamily: 'Playfair Display, serif',

            fontWeight: 700,

            lineHeight: 1.15,

            margin: '20px 0',

            minHeight: '130px',
          }}
        >
          Corporate Event Planning in Sri Lanka
          <br />

          <span className="gold-gradient-text">
            {displayText}

            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',

                width: '4px',

                height: '1em',

                background: '#f39c12',

                marginLeft: '5px',

                animation: 'blink 1s infinite',

                verticalAlign: 'middle',

                transform: 'translateY(-2px)',
              }}
            />
          </span>
        </h1>

        {/* SEO-friendly description */}
        <p
          ref={descRef}
          style={{
            color: '#cbd5e1',

            fontSize: '1.15rem',

            lineHeight: 1.7,

            marginBottom: '35px',

            fontWeight: 300,

            maxWidth: '680px',
          }}
        >
          Teacare Services Pvt Ltd delivers professional corporate event planning,
          event management, catering and hospitality experiences across Sri
          Lanka — from executive high teas and corporate buffets to large-scale
          gala dinners and enterprise events.
        </p>

        {/* CTA Buttons */}
        <div
          ref={btnsRef}
          className="hero-buttons"
        >
          <a
            href="#services"
            className="cta-btn primary"
            style={{
              boxShadow: '0 10px 30px rgba(243,156,18,0.45)',

              display: 'inline-flex',

              alignItems: 'center',

              gap: '10px',

              background:
                'linear-gradient(135deg,#f39c12,#e67e22)',

              color: '#1a202c',

              fontWeight: 700,

              padding: '16px 34px',

              borderRadius: '8px',

              textDecoration: 'none',

              fontSize: '0.95rem',
            }}
          >
            Explore Services

            <i className="fa-solid fa-arrow-right" />
          </a>

          <a
            href="/#testimonials"
            className="cta-btn secondary"
            style={{
              backdropFilter: 'blur(10px)',

              background: 'rgba(255,255,255,0.08)',

              border: '1px solid rgba(255,255,255,0.2)',

              color: '#ffffff',

              fontWeight: 600,

              padding: '16px 34px',

              borderRadius: '8px',

              textDecoration: 'none',

              display: 'inline-flex',

              alignItems: 'center',

              gap: '10px',

              fontSize: '0.95rem',
            }}
          >
            Service Recipients

            <i className="fa-solid fa-star" />
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="hero-stats-container"
          style={{
            display: 'flex',

            gap: '40px',

            marginTop: '50px',

            paddingTop: '30px',

            borderTop:
              '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {[
            {
              num: '150',
              suffix: '+',
              label: 'Events Delivered',
            },

            {
              num: '99',
              suffix: '%',
              label: 'Client Satisfaction',
            },

            {
              num: '15',
              suffix: '+',
              label: 'Years of Experience',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
              }}
            >
              <div
                className="hero-stat-num"
                data-target={stat.num + stat.suffix}
                style={{
                  fontSize: '2.2rem',

                  fontFamily:
                    'Playfair Display, serif',

                  fontWeight: 700,

                  background:
                    'linear-gradient(135deg, #f39c12, #f1c40f)',

                  WebkitBackgroundClip: 'text',

                  WebkitTextFillColor:
                    'transparent',

                  backgroundClip: 'text',
                }}
              >
                {stat.num}
                {stat.suffix}
              </div>

              <div
                style={{
                  fontSize: '0.78rem',

                  color: '#a0aec0',

                  textTransform: 'uppercase',

                  letterSpacing: '1px',

                  fontWeight: 600,

                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
