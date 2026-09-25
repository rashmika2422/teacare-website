import Header from '../components/Header';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Appointment from '../components/Appointment';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';

export default function Home() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#0f141c', color: '#ffffff' }}>
      <ScrollProgress />
      <Header />
      <Hero />
      <Experience />
      <Services />
      <Appointment />
      <Testimonials />
      <Footer />
    </main>
  );
}
