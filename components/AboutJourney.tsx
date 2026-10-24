'use client';

import { useRef } from 'react';
import { revealStyle, useScrollReveal } from './AnimUtils';

const milestones = [
  {
    label: 'Our beginnings',
    title: 'Tea service',
    description:
      'Teacare began with tea service, building its work around thoughtful preparation and warm hospitality.',
    icon: 'fa-mug-hot',
  },
  {
    label: '2019',
    title: 'A private limited company',
    description:
      'The company was registered as a private limited company, formalizing the next step in its growth.',
    icon: 'fa-building',
  },
  {
    label: 'Today',
    title: 'Corporate events and premium hospitality',
    description:
      'Teacare has grown into corporate events, executive high-tea galas, and premium event experiences.',
    icon: 'fa-calendar-check',
  },
];

export default function AboutJourney() {
  const journeyRef = useRef<HTMLDivElement>(null);
  useScrollReveal(journeyRef, 0.15);

  return (
    <div className="about-page-container about-page-journey" ref={journeyRef}>
      <div className="about-page-journey__heading" data-reveal style={revealStyle()}>
        <span className="about-page-eyebrow">How we have grown</span>
        <h3>From tea service to <span className="gold-gradient-text">memorable events</span></h3>
      </div>
      <ol className="about-page-journey__milestones">
        {milestones.map((milestone, index) => (
          <li
            className="about-page-journey__milestone"
            data-reveal
            key={milestone.label}
            style={revealStyle(0.1 + index * 0.16)}
          >
            <span className="about-page-journey__icon" aria-hidden="true">
              <i className={`fa-solid ${milestone.icon}`} />
            </span>
            <span className="about-page-journey__label">{milestone.label}</span>
            <h4>{milestone.title}</h4>
            <p>{milestone.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
