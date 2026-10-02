'use client';

import { useState } from 'react';

export default function Contact() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: fd.get('contactName') as string,
          company:
            (fd.get('contactCompany') as string) || 'N/A',
          email: fd.get('contactEmail') as string,
          eventType:
            'General Inquiry - ' +
            (fd.get('contactSubject') as string),
          message: fd.get('contactMessage') as string,
          date: 'N/A',
          timeSlot: 'N/A',
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess(true);

        form.reset();

        setTimeout(() => {
          setSuccess(false);
        }, 8000);
      } else {
        alert(
          'Submission failed: ' +
            (result.error || 'Please try again.')
        );
      }
    } catch (error) {
      console.error('Contact form submission error:', error);

      alert('Network Error: Cannot connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-us"
      className="contact-us-section"
    >
      <div className="ambient-glow glow-1" />

      <div className="container">
        <div
          className="section-header text-center"
          style={{ marginBottom: '50px' }}
          data-aos="fade-up"
        >
          <h2>
            Contact{' '}
            <span className="gold-gradient-text">
              Our Executive Suite
            </span>
          </h2>

          <p>
            Have a custom event concept or general query?
            Reach out directly to our corporate organizers
          </p>

          <div className="divider" />
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div
            className="contact-info-card"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h3>Teacare Headquarters</h3>

            <p className="contact-sub">
              Visit our offices or connect with us directly
              via phone or email.
            </p>

            <div className="contact-details-list">
              {[
                {
                  icon: 'fa-map-location-dot',
                  label: 'Office Address',
                  val: '663/4, Manaka Road , Ihala Biyanwila, Kadawatha',
                },

                {
                  icon: 'fa-phone-volume',
                  label: 'Direct Helpline',
                  val: '+94 11 2923900 / +94 74 1331010',
                },

                {
                  icon: 'fa-envelope-open-text',
                  label: 'Email Correspondence',
                  val: 'teacare.sl@gmail.com',
                },

                {
                  icon: 'fa-business-time',
                  label: 'Executive Hours',
                  val: 'Mon - Sat: 8:00 AM - 6:00 PM (SLT)',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="contact-detail-item"
                >
                  <div className="detail-icon">
                    <i
                      className={`fa-solid ${item.icon}`}
                    />
                  </div>

                  <div className="detail-text">
                    <strong>{item.label}</strong>
                    <span>{item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="contact-form-card"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <h3>Submit General Inquiry</h3>

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <input
                  type="text"
                  name="contactName"
                  placeholder="Your Name"
                  required
                />

                <input
                  type="text"
                  name="contactCompany"
                  placeholder="Company Name (Optional)"
                />
              </div>

              <input
                type="email"
                name="contactEmail"
                placeholder="Corporate Email Address"
                required
              />

              <input
                type="text"
                name="contactSubject"
                placeholder="Inquiry Subject"
                required
              />

              <textarea
                name="contactMessage"
                rows={5}
                placeholder="Outline your inquiry or event details here..."
                required
              />

              <button
                type="submit"
                className="apply-specs-btn"
                style={{
                  marginTop: '15px',
                  borderRadius: '6px',
                  width: '100%',
                }}
                disabled={loading}
              >
                {loading
                  ? 'Sending...'
                  : 'Submit Inquiry'}{' '}

                <i className="fa-solid fa-paper-plane" />
              </button>
            </form>

            {success && (
              <div
                style={{
                  display: 'block',
                  background:
                    'rgba(46, 204, 113, 0.1)',
                  borderLeft:
                    '4px solid #2ecc71',
                  color: '#2ecc71',
                  padding: '15px',
                  borderRadius: '4px',
                  marginTop: '15px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              >
                ✓ Message Sent! Our representative will
                respond within 24 hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}