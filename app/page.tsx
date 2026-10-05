import Header from '../components/Header';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Appointment from '../components/Appointment';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';

export default function Home() {
  return (
    <main
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#0f141c',
        color: '#ffffff',
      }}
    >
      <ScrollProgress />
      <Header />

      <section
        aria-label="Teacare Services Pvt Ltd introduction"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <h1>Teacare Services Pvt Ltd - Corporate Event Planning in Sri Lanka</h1>

        <p>
          Teacare Services Pvt Ltd provides professional corporate event planning,
          event management, catering and hospitality services in Sri Lanka.
          Our services include executive high teas, corporate buffets,
          gala dinners, business events and customized corporate functions.
        </p>
      </section>

      <Hero />
      <Experience />
      <Services />
      <Appointment />
      <Footer />
    </main>
  );
}
