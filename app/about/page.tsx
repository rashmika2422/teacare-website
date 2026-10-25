import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollProgress from '../../components/ScrollProgress';

const aboutImages = [
  {
    src: '/assets/images/image01.JPG',
    alt: 'TeaCare team preparing a tea service station',
  },
  {
    src: '/assets/images/premium_catering_display.jpg',
    alt: 'Premium catering display prepared for a corporate event',
  },
  {
    src: '/assets/images/c39b0012-f202-44c8-91e8-9751b14876a0.JPG',
    alt: 'TeaCare hospitality service at a corporate event',
  },
  {
    src: '/assets/images/presentation_produtions.JPG',
    alt: 'TeaCare presentation and production setup for a corporate event',
  },
];

const storyMoments = [
  {
    label: 'Our beginnings',
    title: 'Tea service',
    description:
      'Teacare began with tea service, building its work around thoughtful preparation and warm hospitality.',
    image: '/assets/images/hightea_gala.jpg',
    alt: 'TeaCare tea service setup in a refined hospitality setting',
  },
  {
    label: '2019',
    title: 'A private limited company',
    description:
      'The company was registered as a private limited company, formalizing the next step in its growth.',
    image: '/assets/images/premium_catering_display.jpg',
    alt: 'TeaCare business expansion and formal hospitality presentation',
  },
  {
    label: 'Today',
    title: 'Corporate events and premium hospitality',
    description:
      'Teacare has grown into corporate events, executive high-tea galas, and premium event experiences.',
    image: '/assets/images/catering_showcase_custom.jpeg',
    alt: 'TeaCare premium hospitality and event service showcase',
  },
];

const values = [
  {
    icon: 'fa-star',
    title: 'Excellence',
    description: 'Taking care with every detail so each moment feels polished and intentional.',
  },
  {
    icon: 'fa-shield-heart',
    title: 'Reliability',
    description: 'Delivering organised, dependable service that clients can trust throughout the event journey.',
  },
  {
    icon: 'fa-hand-holding-heart',
    title: 'Hospitality',
    description: 'Creating a warm, welcoming experience where every guest feels genuinely looked after.',
  },
  {
    icon: 'fa-people-group',
    title: 'Collaboration',
    description: 'Working closely with clients to shape practical, thoughtful solutions that bring their ideas to life.',
  },
];

const journeySteps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Discover the client’s requirements, objectives, and the atmosphere they want to create.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Coordinate menus, timings, guests, service flow, and event requirements with careful attention to detail.',
  },
  {
    number: '03',
    title: 'Deliver',
    description: 'Execute the agreed arrangements with professionalism, warmth, and smooth on-site coordination.',
  },
  {
    number: '04',
    title: 'Refine',
    description: 'Review the experience, listen to feedback, and look for ways to improve future occasions.',
  },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <ScrollProgress />
      <Header />

      <section className="about-image-showcase" aria-labelledby="about-page-title">
        <div className="about-image-showcase__inner">
          <div className="about-image-showcase__images">
            {aboutImages.map((image) => (
              <div key={image.src} className="about-image-showcase__image">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 980px) 50vw, 44vw" />
              </div>
            ))}
          </div>

          <div className="about-image-showcase__copy">
            <h1 id="about-page-title">
              About <span className="gold-gradient-text">Us</span>
            </h1>

            <div className="about-image-showcase__story">
              {storyMoments.map((moment) => (
                <div key={moment.label} className="about-image-showcase__story-item">
                  <span className="story-moment__eyebrow">{moment.label}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="who-we-are" className="about-story-intro">
        <div className="about-page-container story-intro-grid">
          <div className="story-image-wrap">
            <Image
              src="/assets/images/team.JPG"
              alt="TeaCare team supporting a hospitality-focused corporate event"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 52vw"
              className="story-image"
            />
          </div>

          <div className="story-copy">
            <span className="about-page-eyebrow">Who We Are</span>
            <h2>
              Hospitality, <span className="gold-gradient-text">Thoughtfully Delivered.</span>
            </h2>
            <p>
              TeaCare brings together event planning, catering, and tea hospitality with a practical and polished approach.
              We help organisations create well-managed events and memorable guest experiences through careful coordination,
              responsive communication, and a strong focus on detail.
            </p>
            <p>
              From intimate executive gatherings to larger corporate occasions, our work is shaped by professionalism,
              warmth, and the belief that the small details often make the biggest difference.
            </p>
          </div>
        </div>
      </section>

      <section className="about-vision-section">
        <div className="about-page-container vision-grid">
          <article className="vision-card">
            <span className="about-page-eyebrow">Our Vision</span>
            <h3>
              To be a trusted hospitality and event-services partner, creating meaningful experiences through thoughtful planning,
              quality service, and lasting relationships.
            </h3>
          </article>
          <article className="vision-card">
            <span className="about-page-eyebrow">Our Mission</span>
            <h3>
              To deliver dependable event management, catering, and tea services through careful coordination,
              attention to detail, and a commitment to every client’s needs.
            </h3>
          </article>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-page-container">
          <div className="about-page-section-heading">
            <span className="about-page-eyebrow">Our Values</span>
            <h2>
              The qualities that shape the <span className="gold-gradient-text">TeaCare experience.</span>
            </h2>
          </div>

          <div className="about-values-grid">
            {values.map((value) => (
              <article key={value.title} className="about-value-card">
                <span className="about-value-card__icon" aria-hidden="true">
                  <i className={`fa-solid ${value.icon}`} />
                </span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-experience-section">
        <div className="about-page-container">
          <div className="about-page-section-heading">
            <span className="about-page-eyebrow">The TeaCare Experience</span>
            <h2>
              A practical approach to creating <span className="gold-gradient-text">confident, seamless hospitality.</span>
            </h2>
          </div>

          <div className="experience-steps">
            {journeySteps.map((step) => (
              <article key={step.number} className="experience-step">
                <span className="experience-step__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-page-container about-cta-panel">
          <div>
            <span className="about-page-eyebrow">Let’s create something remarkable</span>
            <h2>
              Let&apos;s Create Something <span className="gold-gradient-text">Remarkable Together.</span>
            </h2>
          </div>
          <p>
            Planning a corporate event or looking for dependable catering and tea services? Let&apos;s discuss how TeaCare can support your next occasion.
          </p>
          <Link href="/contact" className="cta-btn primary">
            Book a Consultation <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
