'use client';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { SectionHeading, useScrollReveal, revealStyle } from './AnimUtils';
import { galleryCarouselImages } from './galleryImages';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

interface ServiceItem { id: string; icon: string; title: string; desc: string; highlights: string[]; }
type ShowcaseMedia =
  | { type: 'image'; src: string; title: string }
  | { type: 'carousel'; images: readonly string[]; title: string }
  | { type: 'video'; src: string; poster: string; title: string; contentType: 'video/mp4' | 'video/quicktime' };
type ViewerMedia = Exclude<ShowcaseMedia, { type: 'carousel' }>;

const serviceDetails: ServiceItem[] = [
  { id: 'tea', icon: 'fa-mug-hot', title: 'Executive High Tea', desc: 'Curated premier tea blends, delicate porcelain styling, and fine pastries for high-tier networking intervals.', highlights: ['Single-Origin Ceylon Teas', 'Bespoke Porcelain Layouts', 'Artisanal Pastry Platters', 'Dedicated Tea Sommelier'] },
  { id: 'buffet', icon: 'fa-utensils', title: 'Corporate Buffets', desc: 'Lavish culinary experiences engineered to suit vast global palates with pristine aesthetic setups.', highlights: ['Multi-Cuisine Selection', 'Live Chef Stations', 'Elegantly Plated Canapés', 'VIP Delegate Service'] },
  { id: 'production', icon: 'fa-display', title: 'Presentation Production', desc: 'Flawless catering, crystal-clear acoustics, and visual arrangements for key corporate launches.', highlights: ['Full Stage & Lighting Rig', 'High-Fidelity Audio Setup', 'Press Lounge Hospitality', 'Seamless Brand Alignment'] },
  { id: 'summit', icon: 'fa-building-columns', title: 'Cooperative Summits', desc: 'Flawless management of inter-company forums and national conferences around your objectives.', highlights: ['Keynote Stage Logistics', 'Breakout Refreshment Stations', 'Multilingual Hostesses', 'End-to-End Floor Protocol'] }
];

const showcaseMedia: ShowcaseMedia[] = [
  { type: 'image', src: '/assets/images/highteagala.JPG', title: 'High Tea Gala' },
  { type: 'image', src: '/assets/images/presentation_produtions.JPG', title: 'Presentation Production' },
  { type: 'image', src: '/assets/images/snack_station.JPG', title: 'Snack Station' },
  { type: 'carousel', images: galleryCarouselImages, title: 'TeaCare Event Gallery' },
  { type: 'video', src: '/assets/images/executive_table_arrangement.MOV', poster: '/assets/images/executive_table_arrangement_poster.jpg', title: 'Executive Table Arrangement', contentType: 'video/quicktime' },
  { type: 'video', src: '/assets/images/aboutus1.mp4', poster: '/assets/images/aboutus_video_poster.jpg', title: 'About Us', contentType: 'video/mp4' },
];

const viewerMedia: ViewerMedia[] = showcaseMedia.flatMap((media) => {
  if (media.type === 'carousel') {
    return media.images.map((src, index) => ({
      type: 'image' as const,
      src,
      title: `Event photo ${index + 1}`,
    }));
  }
  return [media];
});

function getViewerIndex(mediaIndex: number, imageIndex = 0) {
  return showcaseMedia.slice(0, mediaIndex).reduce((count, media) => (
    count + (media.type === 'carousel' ? media.images.length : 1)
  ), 0) + imageIndex;
}

function GalleryCarousel({
  images,
  title,
  onOpen,
}: {
  images: readonly string[];
  title: string;
  onOpen: (imageIndex: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => true,
  );

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 3500);
    return () => window.clearInterval(intervalId);
  }, [images.length, isPlaying, prefersReducedMotion]);

  return (
    <>
      <Image
        key={images[activeIndex]}
        src={images[activeIndex]}
        alt={`${title}: event photo ${activeIndex + 1} of ${images.length}`}
        fill
        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
        className="media-bg gallery-carousel-image"
        style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <button
        type="button"
        className="media-view-trigger"
        aria-label={`View ${title}, photo ${activeIndex + 1} of ${images.length}`}
        onClick={() => onOpen(activeIndex)}
      />
      <div className="gallery-carousel-controls">
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause event photo slideshow' : 'Play event photo slideshow'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveIndex((index) => (index + 1) % images.length)}
          aria-label="Show next event photo"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modalAnim, setModalAnim] = useState(false);
  const [selectedViewerIndex, setSelectedViewerIndex] = useState<number | null>(null);
  const isViewerOpen = selectedViewerIndex !== null;
  const gridRef = useRef<HTMLDivElement>(null);
  const mediaGridRef = useRef<HTMLDivElement>(null);
  const viewerCloseButtonRef = useRef<HTMLButtonElement>(null);

  useScrollReveal(mediaGridRef);

  const closeModal = () => { setModalAnim(false); setTimeout(() => setSelectedService(null), 300); };
  const openModal = (s: ServiceItem) => { setSelectedService(s); requestAnimationFrame(() => setModalAnim(true)); };

  useEffect(() => {
    if (!isViewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    viewerCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedViewerIndex(null);
      if (event.key === 'ArrowLeft') {
        setSelectedViewerIndex((index) => index === null
          ? null
          : (index - 1 + viewerMedia.length) % viewerMedia.length);
      }
      if (event.key === 'ArrowRight') {
        setSelectedViewerIndex((index) => index === null
          ? null
          : (index + 1) % viewerMedia.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isViewerOpen]);

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
          {showcaseMedia.map((media, i) => (
            <div key={i} data-reveal style={{ 
              ...revealStyle(i * 0.15), 
              position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden', 
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer' 
            }}
            role={media.type === 'carousel' ? 'group' : undefined}
            aria-roledescription={media.type === 'carousel' ? 'carousel' : undefined}
            aria-label={media.type === 'carousel' ? media.title : undefined}
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
                  className="media-bg" autoPlay muted loop preload="metadata" playsInline poster={media.poster} aria-label={media.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <source src={media.src} type={media.contentType} />
                  Your browser does not support this video format.
                </video>
              ) : media.type === 'carousel' ? (
                <GalleryCarousel
                  images={media.images}
                  title={media.title}
                  onOpen={(imageIndex) => setSelectedViewerIndex(getViewerIndex(i, imageIndex))}
                />
              ) : (
                <Image
                  src={media.src}
                  alt={media.title}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
                  className="media-bg"
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                />
              )}
              {media.type !== 'carousel' && (
                <button
                  type="button"
                  className="media-view-trigger"
                  aria-label={`View ${media.title}`}
                  onClick={() => setSelectedViewerIndex(getViewerIndex(i))}
                />
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
      </div>

      {selectedViewerIndex !== null && (
        <div
          className="gallery-viewer"
          role="presentation"
          onClick={() => setSelectedViewerIndex(null)}
        >
          <div
            className="gallery-viewer__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={viewerMedia[selectedViewerIndex].title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={viewerCloseButtonRef}
              type="button"
              className="gallery-viewer__close"
              onClick={() => setSelectedViewerIndex(null)}
              aria-label="Close media viewer"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery-viewer__arrow gallery-viewer__arrow--previous"
              onClick={() => setSelectedViewerIndex((index) => index === null
                ? null
                : (index - 1 + viewerMedia.length) % viewerMedia.length)}
              aria-label="View previous gallery item"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            </button>
            <div className="gallery-viewer__media">
              {viewerMedia[selectedViewerIndex].type === 'video' ? (
                <video
                  key={viewerMedia[selectedViewerIndex].src}
                  controls
                  autoPlay
                  playsInline
                  className="gallery-viewer__video"
                  poster={viewerMedia[selectedViewerIndex].poster}
                  aria-label={viewerMedia[selectedViewerIndex].title}
                >
                  <source
                    src={viewerMedia[selectedViewerIndex].src}
                    type={viewerMedia[selectedViewerIndex].contentType}
                  />
                  Your browser does not support this video format.
                </video>
              ) : (
                <Image
                  key={viewerMedia[selectedViewerIndex].src}
                  src={viewerMedia[selectedViewerIndex].src}
                  alt={viewerMedia[selectedViewerIndex].title}
                  fill
                  sizes="100vw"
                  className="gallery-viewer__image"
                />
              )}
            </div>
            <button
              type="button"
              className="gallery-viewer__arrow gallery-viewer__arrow--next"
              onClick={() => setSelectedViewerIndex((index) => index === null
                ? null
                : (index + 1) % viewerMedia.length)}
              aria-label="View next gallery item"
            >
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
            <p className="gallery-viewer__caption" aria-live="polite">
              {viewerMedia[selectedViewerIndex].title} · {selectedViewerIndex + 1} of {viewerMedia.length}
            </p>
          </div>
        </div>
      )}

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
