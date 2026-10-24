'use client';

import { useRef, useState, type UIEvent } from 'react';

const purposes = [
  {
    icon: 'fa-seedling',
    label: 'Our mission',
    title: 'Make every gathering feel considered',
    description:
      'To create welcoming corporate experiences through attentive service, thoughtful catering, and well-coordinated event support.',
  },
  {
    icon: 'fa-compass',
    label: 'Our vision',
    title: 'Bring people together, beautifully',
    description:
      "To help make warm, dependable hospitality part of every organization's most meaningful moments.",
  },
];

export default function AboutPurposeCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateActiveIndex(event: UIEvent<HTMLDivElement>) {
    const carousel = event.currentTarget;
    const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    const closestIndex = Array.from(carousel.children).reduce(
      (closest, card, index, cards) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left +
            card.getBoundingClientRect().width / 2 -
            carouselCenter,
        );
        const closestCard = cards[closest];
        const closestDistance = Math.abs(
          closestCard.getBoundingClientRect().left +
            closestCard.getBoundingClientRect().width / 2 -
            carouselCenter,
        );
        return distance < closestDistance ? index : closest;
      },
      0,
    );
    setActiveIndex(closestIndex);
  }

  function scrollToCard(index: number) {
    const carousel = carouselRef.current;
    const card = carousel?.children[index];
    if (!carousel || !(card instanceof HTMLElement)) return;

    const left = carousel.scrollLeft +
      card.getBoundingClientRect().left -
      carousel.getBoundingClientRect().left;

    carousel.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <>
      <div
        className="about-page-purpose__grid"
        ref={carouselRef}
        onScroll={updateActiveIndex}
        aria-label="Our mission and vision"
      >
        {purposes.map((purpose, index) => (
          <article
            className="about-page-purpose-card"
            data-scroll-reveal
            key={purpose.label}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <span className="about-page-purpose-card__icon" aria-hidden="true">
              <i className={`fa-solid ${purpose.icon}`} />
            </span>
            <span className="about-page-card-label">{purpose.label}</span>
            <h3>{purpose.title}</h3>
            <p>{purpose.description}</p>
          </article>
        ))}
      </div>
      <div className="about-page-purpose-controls" aria-label="Mission and vision carousel controls">
        <button
          type="button"
          className="about-page-purpose-arrow"
          onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Show previous card"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        </button>
        <div className="about-page-purpose-dots" aria-label="Choose a card">
          {purposes.map((purpose, index) => (
            <button
              type="button"
              key={purpose.label}
              className={`about-page-purpose-dot${activeIndex === index ? ' is-active' : ''}`}
              onClick={() => scrollToCard(index)}
              aria-label={`Show ${purpose.label.toLowerCase()}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="about-page-purpose-arrow"
          onClick={() => scrollToCard(Math.min(purposes.length - 1, activeIndex + 1))}
          disabled={activeIndex === purposes.length - 1}
          aria-label="Show next card"
        >
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
        <span className="sr-only" aria-live="polite">
          {purposes[activeIndex].label}, {activeIndex + 1} of {purposes.length}
        </span>
      </div>
    </>
  );
}
