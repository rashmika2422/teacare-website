import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AboutJourney from '../../components/AboutJourney';
import AboutScrollEffects from '../../components/AboutScrollEffects';
import AboutPurposeCarousel from '../../components/AboutPurposeCarousel';
import ScrollProgress from '../../components/ScrollProgress';

const values = [
  {
    icon: 'fa-heart',
    title: 'Thoughtful care',
    description: 'Warm, attentive hospitality that helps every guest feel welcome.',
  },
  {
    icon: 'fa-mug-hot',
    title: 'Pride in the details',
    description: 'Considered presentation, quality catering, and a well-prepared tea service.',
  },
  {
    icon: 'fa-clock',
    title: 'Reliable delivery',
    description: 'Calm, coordinated service shaped around each event and its schedule.',
  },
  {
    icon: 'fa-handshake',
    title: 'A partner mindset',
    description: 'Working closely with each client to create an experience that feels right.',
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <ScrollProgress />
      <AboutScrollEffects />
      <Header />

      <section className="about-page-hero" aria-labelledby="about-page-title">
        <div className="about-page-hero__content" data-scroll-reveal>
          <span className="about-page-eyebrow">A warm welcome, thoughtfully delivered</span>
          <h1 id="about-page-title">
            Hospitality that brings
            <span className="gold-gradient-text"> people together</span>
          </h1>
          <p>
            Teacare Services Pvt Ltd brings corporate events, catering, and tea
            hospitality together with care, craft, and a distinctly Sri Lankan
            warmth.
          </p>
          <Link className="cta-btn primary about-page-button" href="/#appointment">
            Plan Your Event <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
        <a className="about-page-scroll" href="#our-story" aria-label="Scroll to our story">
          <i className="fa-solid fa-arrow-down" aria-hidden="true" />
        </a>
      </section>

      <section className="about-page-story" id="our-story" aria-label="TeaCare team and company journey">
        <AboutJourney />
      </section>

      <section className="about-page-purpose" aria-labelledby="about-purpose-title">
        <div className="about-page-container">
          <div className="about-page-section-heading" data-scroll-reveal>
            <span className="about-page-eyebrow">What guides us</span>
            <h2 id="about-purpose-title">Good hospitality, <span className="gold-gradient-text">with purpose</span></h2>
            <p>The care we bring to every event starts with what matters to us.</p>
          </div>

          <AboutPurposeCarousel />
        </div>
      </section>

      <section className="about-page-values" aria-labelledby="about-values-title">
        <div className="about-page-container">
          <div className="about-page-section-heading" data-scroll-reveal>
            <span className="about-page-eyebrow">The way we work</span>
            <h2 id="about-values-title">Care in every <span className="gold-gradient-text">detail</span></h2>
          </div>
          <div className="about-page-values__grid">
            {values.map((value, index) => (
              <article
                className="about-page-value-card"
                data-scroll-reveal
                key={value.title}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span className="about-page-value-card__icon" aria-hidden="true">
                  <i className={`fa-solid ${value.icon}`} />
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page-team" aria-label="TeaCare team">
        <div className="about-page-container about-page-story__grid">
          <div className="about-page-story__images" data-scroll-reveal>
            <figure className="about-page-story__main-image" data-scroll-reveal>
              <Image
                src="/assets/images/team.JPG"
                alt="TeaCare team gathered together"
                width={1280}
                height={958}
                sizes="(max-width: 768px) 100vw, 48vw"
              />
              <span className="about-page-story__image-gradient" aria-hidden="true" />
              <figcaption className="about-page-photo-note">
                <p>Plan your next event with our team.</p>
                <Link className="cta-btn primary about-page-button about-page-team-cta" href="/#appointment">
                  Book an Appointment <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
