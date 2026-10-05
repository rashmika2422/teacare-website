'use client';
import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    const header = document.querySelector('header');
    const onScroll = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', onScroll);

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    const toggleNav = () => {
      nav?.classList.toggle('nav-active');
      burger?.classList.toggle('toggle');
    };
    const closeNav = () => {
      nav?.classList.remove('nav-active');
      burger?.classList.remove('toggle');
    };

    burger?.addEventListener('click', toggleNav);
    links.forEach(l => l.addEventListener('click', closeNav));

    return () => {
      window.removeEventListener('scroll', onScroll);
      burger?.removeEventListener('click', toggleNav);
    };
  }, []);

  return (
    <header>
      <div className="logo">
        <a href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <img src="/assets/images/IMG_8664.jpeg" alt="Teacare Services Pvt Ltd Logo" className="logo-img" />
          Teacare Services Pvt Ltd
        </a>
      </div>
      <nav>
        <ul className="nav-links">
          <li><a href="/#hero">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/#services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
         
          <li><a href="/#appointment" className="btn-nav">Book Appointment</a></li>
        </ul>
        <div className="burger">
          <div className="line1" />
          <div className="line2" />
          <div className="line3" />
        </div>
      </nav>
    </header>
  );
}
