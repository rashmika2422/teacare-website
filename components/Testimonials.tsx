'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PublishedFeedback {
  id: string;
  name: string;
  rating: number;
  message: string;
  timestamp: string;
}

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [publishedFeedback, setPublishedFeedback] = useState<PublishedFeedback[]>([]);
  const [feedbackLoadError, setFeedbackLoadError] = useState('');
  const [rating, setRating] = useState(0);
  const [submission, setSubmission] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | '';
  }>({ message: '', type: '' });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll<HTMLElement>('.testimonial-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, i * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/feedback/published`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Published feedback is temporarily unavailable.');
        const data: PublishedFeedback[] = await response.json();
        setPublishedFeedback(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to load published feedback:', error);
        setFeedbackLoadError('Published feedback is temporarily unavailable.');
      });
  }, [API_URL]);

  const reviews = [
    {
      name: 'Ruvini Udayangani',
      role: 'Manager - Human Resources, Fulgar Lanka (Pvt) Ltd',
      img: '/assets/images/fulgar-logo.png',
      text: 'We would like to express our sincere appreciation for your excellent support in arranging hospitality services for our VIP customer visit. Thank you for your commitment, professionalism, and attention to detail in ensuring a pleasant and memorable experience for our guests. Your valuable contribution and cooperation are highly appreciated. We look forward to continuing our successful partnership with you.',
    },
  ];
  const recipients = [
    { name: 'Brandix', src: '/assets/images/Brandix_Logo.png', width: 4000, height: 1975 },
    { name: 'Avery Dennison', src: '/assets/images/avery-dennison-logo.png', width: 2000, height: 652 },
    { name: 'Fulgar', src: '/assets/images/fulgar-logo.png', width: 2000, height: 1288 },
    { name: 'Ascent', src: '/assets/images/Ascent-logo.jpeg', width: 2058, height: 764 },
    { name: 'Control Union', src: '/assets/images/control-union-logo.png', width: 2000, height: 314 },
    { name: 'Savinda Graphics', src: '/assets/images/savinda-graphics-logo.png', width: 406, height: 166 },
  ];

  async function handleFeedbackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmission({ message: 'Sending your feedback...', type: 'loading' });

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          rating,
          message: formData.get('message'),
        }),
      });
      const result: {
        success?: boolean;
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'We could not submit your feedback. Please try again.');
      }

      form.reset();
      setRating(0);
      setSubmission({
        message: 'Thank you! Your feedback has been submitted successfully.',
        type: 'success',
      });
    } catch (error) {
      setSubmission({
        message: error instanceof Error ? error.message : 'We could not submit your feedback. Please try again.',
        type: 'error',
      });
    }
  }

  return (
    <section id="testimonials" className="client-testimonials">
      <div className="ambient-glow glow-3" style={{ top: '-100px', left: '-200px' }} />
      <div className="recipient-section">
        <h2 className="recipient-title">Service <span className="gold-gradient-text">Recipients</span></h2>
        <div className="recipient-logos" role="region" aria-label="Service recipients">
          <div className="recipient-logo-track">
            <div className="recipient-logo-group" role="list">
              {recipients.map((recipient) => (
                <Image
                  key={recipient.name}
                  className="recipient-logo"
                  src={recipient.src}
                  alt={recipient.name}
                  width={recipient.width}
                  height={recipient.height}
                  role="listitem"
                />
              ))}
            </div>
            <div className="recipient-logo-group" aria-hidden="true">
              {recipients.map((recipient) => (
                <Image
                  key={recipient.name}
                  className="recipient-logo"
                  src={recipient.src}
                  alt=""
                  width={recipient.width}
                  height={recipient.height}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="testimonial-header">
        <h2>Trusted By <span className="gold-gradient-text">Industry Leaders</span></h2>
        <div className="gold-divider" />
        <p>Our commitment to flawless execution has made us the premier choice for enterprise hospitality.</p>
      </div>
      <div ref={gridRef} className="testimonial-grid">
        {reviews.map((r, i) => (
          <div key={r.name} className="testimonial-card" style={{ opacity: 0, transform: 'translateY(30px) scale(0.95)', transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s` }}>
            <div className="stars">
              {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star" />)}
            </div>
            <p className="review-text">{r.text}</p>
            <div className="executive-profile">
              <Image
                src={r.img}
                alt={`${r.name}'s organization`}
                className="executive-img"
                width={100}
                height={100}
              />
              <div className="executive-info">
                <h4>{r.name}</h4>
                <span>{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="feedback-header">
        <h3>Share Your <span className="gold-gradient-text">Feedback</span></h3>
        <p>Your experience matters to us. Tell us how we did.</p>
      </div>
      <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
        <div className="feedback-input-row">
          <label>
            Name
            <input name="name" type="text" autoComplete="name" maxLength={100} required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" maxLength={254} required />
          </label>
        </div>
        <fieldset className="feedback-rating">
          <legend>Your rating</legend>
          <div className="feedback-stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className={value <= rating ? 'selected' : ''}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  required={value === 1}
                />
                <span aria-hidden="true">★</span>
                <span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="feedback-message-label">
          Your feedback
          <textarea name="message" rows={5} minLength={10} maxLength={2000} required />
        </label>
        <button className="submit-btn" type="submit" disabled={submission.type === 'loading' || rating === 0}>
          {submission.type === 'loading' ? 'Sending...' : 'Send Feedback'}
        </button>
        {submission.message && (
          <p className={`feedback-status ${submission.type}`} role="status" aria-live="polite">
            {submission.message}
          </p>
        )}
      </form>
      {(publishedFeedback.length > 0 || feedbackLoadError) && (
        <div className="published-feedback-section">
          <div className="testimonial-header">
            <h2>Feedback from <span className="gold-gradient-text">Our Clients</span></h2>
            <div className="gold-divider" />
            <p>Experiences shared by clients.</p>
          </div>
          {feedbackLoadError ? (
            <p className="feedback-load-error" role="status">{feedbackLoadError}</p>
          ) : (
            <div className="testimonial-grid">
              {publishedFeedback.map((review) => (
                <div key={review.id} className="testimonial-card">
                  <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={star <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="review-text">{review.message}</p>
                  <div className="executive-profile">
                    <div className="feedback-avatar" aria-hidden="true">
                      {review.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="executive-info">
                      <h4>{review.name}</h4>
                      <span>Teacare client</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
