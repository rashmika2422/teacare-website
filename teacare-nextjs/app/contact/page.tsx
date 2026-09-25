import Header from '../../components/Header';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';

export default function ContactPage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', background: 'var(--dark-gray)', color: '#ffffff', fontFamily: 'Poppins, sans-serif' }}>
      <Header />
      
      {/* Hero Header for Contact */}
      <section className="about-hero" style={{
        position: 'relative',
        padding: '160px 8% 100px',
        backgroundImage: 'linear-gradient(180deg, rgba(15,20,28,0.5) 0%, rgba(15,20,28,0.7) 60%, var(--dark-gray) 100%), url("/assets/images/image01.JPG")',
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
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </a>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ 
            color: '#f39c12', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', 
            fontSize: '0.85rem', display: 'inline-block', marginBottom: '15px' 
          }}>
            Executive Suite Communication
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', color: '#ffffff', margin: '0 0 25px', lineHeight: 1.1 }}>
            Contact <br/><span className="gold-gradient-text">Teacare Headquarters</span>
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 300 }}>
            Reach out directly to our lead organizers, schedule consultation briefings, or inquire about custom corporate hospitality packages.
          </p>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
