'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export default function AboutImageCarousel({ images }: { images: readonly string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => true,
  );

  const showImage = useCallback((nextIndex: number) => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    if (prefersReducedMotion) {
      setActiveIndex(nextIndex);
      setOutgoingIndex(null);
      return;
    }

    setOutgoingIndex(activeIndex);
    setActiveIndex(nextIndex);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setOutgoingIndex(null);
      transitionTimeoutRef.current = null;
    }, 650);
  }, [activeIndex, prefersReducedMotion]);

  useEffect(() => () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || images.length < 2) return;

    const intervalId = window.setInterval(() => {
      showImage((activeIndex + 1) % images.length);
    }, 2600);
    return () => window.clearInterval(intervalId);
  }, [activeIndex, images.length, prefersReducedMotion, showImage]);

  function showPreviousImage() {
    showImage((activeIndex - 1 + images.length) % images.length);
  }

  function showNextImage() {
    showImage((activeIndex + 1) % images.length);
  }

  return (
    <div
      className="about-image-showcase__carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label="TeaCare event gallery"
    >
      {outgoingIndex !== null && (
        <Image
          key={`outgoing-${images[outgoingIndex]}`}
          src={images[outgoingIndex]}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 980px) 100vw, 58vw"
          className="about-image-showcase__carousel-image is-outgoing"
        />
      )}
      <Image
        key={`active-${images[activeIndex]}`}
        src={images[activeIndex]}
        alt={`TeaCare corporate hospitality and event gallery, photo ${activeIndex + 1} of ${images.length}`}
        fill
        priority={activeIndex === 0}
        sizes="(max-width: 980px) 100vw, 58vw"
        className="about-image-showcase__carousel-image is-active"
      />
      <div className="about-image-showcase__carousel-caption" aria-live="polite">
        <span>TeaCare Event Gallery</span>
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>
      <div className="about-image-showcase__carousel-controls">
        <button type="button" onClick={showPreviousImage} aria-label="Show previous event photo">
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        </button>
        <button type="button" onClick={showNextImage} aria-label="Show next event photo">
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
