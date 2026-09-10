'use client';
import { useState, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Appointment() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [summaryHtml, setSummaryHtml] = useState('Please select a <strong>Date</strong> from the calendar to proceed. (Preferred time is optional)');
  const [summaryStyle, setSummaryStyle] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [formMsg, setFormMsg] = useState<{ html: string; type: 'success'|'error'|'loading'|'' }>({ html: '', type: '' });

  // Update summary badge whenever date or time changes
  useEffect(() => {
    if (selectedDate && preferredTime.trim()) {
      const [y, m, d] = selectedDate.split('-');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      const readable = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      setSummaryHtml(`✅ Confirm Appointment on <strong>${readable}</strong> at <strong>${preferredTime.trim()}</strong>.`);
      setSummaryStyle({ borderLeftColor: '#2ecc71', background: 'rgba(46,204,113,0.07)' });
      setSubmitDisabled(false);
    } else if (selectedDate) {
      const [y, m, d] = selectedDate.split('-');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      const readable = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      setSummaryHtml(`📅 Date selected: <strong>${readable}</strong>. You may optionally type a preferred time below.`);
      setSummaryStyle({ borderLeftColor: '#f39c12', background: 'rgba(243,156,18,0.07)' });
      setSubmitDisabled(false);
    } else {
      setSummaryHtml('Please select a <strong>Date</strong> from the calendar to proceed. (Preferred time is optional)');
      setSummaryStyle({});
      setSubmitDisabled(true);
    }
  }, [selectedDate, preferredTime]);

  // Render calendar days
  const renderDays = () => {
    const today = new Date();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= lastDay; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = cellDate < compareToday;
      const isToday = currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate();
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate;

      let cls = 'calendar-day';
      if (isPast) cls += ' disabled';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';

      cells.push(
        <button key={day} type="button" className={cls} disabled={isPast}
          onClick={() => !isPast && setSelectedDate(dateStr)}>
          {day}
        </button>
      );
    }
    return cells;
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDate) {
      setSummaryHtml('⚠️ <strong>Please select a date</strong> from the calendar before submitting.');
      setSummaryStyle({ borderLeftColor: '#e74c3c', background: 'rgba(231,76,60,0.08)' });
      document.querySelector('.calendar-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const clientName = fd.get('corpName') as string;
    const company = fd.get('companyName') as string;
    const email = fd.get('corpEmail') as string;
    const eventType = fd.get('eventType') as string;
    let message = (fd.get('corpMsg') as string) || '';

    // Attach planner specs if applied
    const plannerTier = (window as any)._calcSelectedTier;
    const plannerAddons = (window as any)._calcAddonsBreakdown;
    if (plannerTier) {
      message += `\n\n--- EVENT PLANNER SPECIFICATIONS ---\n- Guest Count: ${(window as any)._calcGuests || 'N/A'}\n- Event Duration: ${(window as any)._calcHours || 'N/A'} hours\n- Catering Package: ${(window as any)._calcCatering || 'N/A'}\n- Service Executive Tier: ${plannerTier} Tier\n- Production Add-ons: ${plannerAddons?.length > 0 ? '\n  · ' + plannerAddons.join('\n  · ') : 'None'}`;
    }

    setFormMsg({ html: 'Reserving your scheduled slot...', type: 'loading' });

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, company, email, eventType, message, date: selectedDate, timeSlot: preferredTime.trim() }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setFormMsg({ html: `<strong>Appointment Booked!</strong><br>Thank you, ${clientName}. We have scheduled your corporate brief for <strong>${selectedDate}${preferredTime.trim() ? ` at ${preferredTime.trim()}` : ''}</strong>.`, type: 'success' });
        form.reset();
        setSelectedDate('');
        setPreferredTime('');
      } else {
        setFormMsg({ html: `<strong>Booking Failed:</strong> ${result.error || 'Please try again.'}`, type: 'error' });
      }
    } catch {
      setFormMsg({ html: '<strong>Network Error:</strong> Cannot reach the booking server.', type: 'error' });
    }
  };

  const formMsgStyle = formMsg.type === 'success'
    ? { background: '#d4edda', color: '#155724', padding: '15px', marginTop: '15px', borderRadius: '5px' }
    : formMsg.type === 'error'
    ? { background: '#f8d7da', color: '#721c24', padding: '15px', marginTop: '15px', borderRadius: '5px' }
    : { background: '#e2e8f0', color: '#1a202c', padding: '15px', marginTop: '15px', borderRadius: '5px' };

  return (
    <section id="appointment" className="appointment-section">
      <div className="container">
        <div className="section-header text-center" style={{ marginBottom: '40px' }} data-aos="fade-up">
          <h2>Schedule Your <span className="gold-gradient-text">Event Consultation</span></h2>
          <p>Reserve an executive planning slot and share your event objectives with our lead architects</p>
          <div className="divider" />
        </div>
        <div className="appointment-grid">
          {/* Left: Calendar */}
          <div className="calendar-card" data-aos="fade-right" data-aos-duration="1000">
            <div className="calendar-header">
              <h3>{MONTHS[currentMonth]} {currentYear}</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="calendar-nav-btn" onClick={prevMonth}><i className="fa-solid fa-chevron-left" /></button>
                <button type="button" className="calendar-nav-btn" onClick={nextMonth}><i className="fa-solid fa-chevron-right" /></button>
              </div>
            </div>
            <div className="calendar-weekdays">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar-days-grid">
              {renderDays()}
            </div>
            <div className="slots-section">
              <h4><i className="fa-solid fa-clock" /> Preferred Time</h4>
              <p style={{ fontSize: '0.82rem', color: '#f39c12', margin: '4px 0 6px', fontWeight: 600 }}>* This field is an alternative (Optional)</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--mid-gray)', margin: '0 0 10px' }}>Type your preferred time (e.g. 9:00 AM, 2:30 PM) or leave blank.</p>
              <input
                type="text"
                id="preferred-time-input"
                placeholder="e.g. 9:00 AM or 2:30 PM"
                className="premium-time-input"
                autoComplete="off"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="booking-form-card" data-aos="fade-left" data-aos-duration="1000">
            <h3>Booking Details</h3>
            <div
              className="booking-summary-badge"
              style={summaryStyle}
              dangerouslySetInnerHTML={{ __html: summaryHtml }}
            />
            <form id="appointment-booking-form" onSubmit={handleSubmit}>
              <div className="input-row">
                <input type="text" name="corpName" placeholder="Your Name" required />
                <input type="text" name="companyName" placeholder="Company Name" required />
              </div>
              <input type="email" name="corpEmail" placeholder="Corporate Email Address" required />
              <select id="appt-event-type" name="eventType" required defaultValue="">
                <option value="" disabled>Select Event Classification</option>
                <option value="Executive High Tea">Executive High Tea Gala</option>
                <option value="Premium Buffet">Premium Enterprise Buffet</option>
                <option value="Presentation Production">Launch / Presentation Production</option>
                <option value="Cooperative Summit">Cooperative Summit / Conference</option>
              </select>
              <textarea id="appt-msg" name="corpMsg" rows={4} placeholder="Briefly describe your event objectives..." required />
              <button type="submit" className="submit-btn" disabled={submitDisabled}>
                Request Appointment &amp; Submit Brief <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
            {formMsg.html && (
              <div style={formMsgStyle} dangerouslySetInnerHTML={{ __html: formMsg.html }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
