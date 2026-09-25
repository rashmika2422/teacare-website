'use client';
import { useState, useEffect } from 'react';

interface Item {
  id: string;
  timestamp: string;
  name: string;
  company?: string;
  email: string;
  eventType: string;
  message: string;
  date: string;
  timeSlot: string;
  priorityTier?: string;
  status: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'inquiries'>('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('teacare_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if ((u === 'admin' || u === 'rashmika') && (p === 'teacare123' || p === 'admin' || p === 'rashmika')) {
      setIsAuthenticated(true);
      localStorage.setItem('teacare_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password. Allowed: username "admin" or "rashmika", password "teacare123".');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('teacare_admin_auth');
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
      const interval = setInterval(fetchItems, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f141c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.95)',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid rgba(243, 156, 18, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f39c12, #e67e22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '1.5rem',
            color: '#1a202c',
            boxShadow: '0 4px 15px rgba(243, 156, 18, 0.4)'
          }}>
            🔒
          </div>
          <h2 style={{ color: '#ffffff', fontFamily: 'Playfair Display, serif', marginBottom: '8px', fontSize: '1.8rem' }}>
            Executive Admin Portal
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '25px' }}>
            Please authenticate to access sensitive corporate bookings &amp; inquiries.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Username (e.g. admin or rashmika)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#0f141c',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <input
              type="password"
              placeholder="Password (e.g. teacare123)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#0f141c',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            {loginError && (
              <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>{loginError}</p>
            )}
            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                color: '#1a202c',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)',
                marginTop: '10px'
              }}
            >
              Unlock Dashboard 🔓
            </button>
          </form>

          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <a href="/" style={{ color: '#a0aec0', fontSize: '0.8rem', textDecoration: 'none' }}>
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const appointments = items.filter(i => i.date !== 'N/A' && i.timeSlot !== 'N/A');
  const inquiries = items.filter(i => i.date === 'N/A' || i.timeSlot === 'N/A');

  const currentList = activeTab === 'appointments' ? appointments : inquiries;

  const filteredList = currentList.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.company || '').toLowerCase().includes(q) ||
      (item.email || '').toLowerCase().includes(q) ||
      (item.eventType || '').toLowerCase().includes(q) ||
      (item.message || '').toLowerCase().includes(q)
    );
  });

  const selectedItem = items.find(i => i.id === selectedId) || filteredList[0] || null;

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/appointments/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !replyText.trim()) return;

    setSendingReply(true);
    setReplySuccess('');
    try {
      const res = await fetch('/api/appointments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: selectedItem.email,
          subject: `Re: ${selectedItem.eventType} - Teacare Events`,
          replyText: replyText,
        }),
      });
      if (res.ok) {
        setReplySuccess('Reply sent successfully to ' + selectedItem.email);
        setReplyText('');
        setTimeout(() => setReplySuccess(''), 5000);
      } else {
        alert('Failed to send reply.');
      }
    } catch (err) {
      alert('Error sending reply.');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#0f141c', color: '#f7fafc', fontFamily: 'Poppins, sans-serif', padding: '20px 40px' }}>
      {/* Top Header */}
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#f39c12', margin: 0 }}>
            Teacare Executive Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '4px 0 0' }}>
            Real-time Appointment &amp; Inquiry Operations Console
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '8px 18px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
            ← Main Site
          </a>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', padding: '8px 18px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(231, 76, 60, 0.4)', cursor: 'pointer', fontWeight: 600 }}
          >
            Logout 🔒
          </button>
        </div>
      </header>

      {/* Analytics KPIs Banner */}
      <div className="admin-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', margin: '25px 0' }}>
        <div style={{ background: '#1a202c', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f39c12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Bookings</span>
          <h2 style={{ fontSize: '2rem', margin: '6px 0 0', color: '#ffffff' }}>{appointments.length}</h2>
        </div>
        <div style={{ background: '#1a202c', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #6c5ce7', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>General Inquiries</span>
          <h2 style={{ fontSize: '2rem', margin: '6px 0 0', color: '#ffffff' }}>{inquiries.length}</h2>
        </div>
        <div style={{ background: '#1a202c', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #00cecb', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Action</span>
          <h2 style={{ fontSize: '2rem', margin: '6px 0 0', color: '#f1c40f' }}>
            {items.filter(i => i.status === 'Pending Review' || !i.status).length}
          </h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Column: Navigation & List */}
        <div style={{ background: '#1a202c', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            <button
              onClick={() => { setActiveTab('appointments'); setSelectedId(null); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === 'appointments' ? '#f39c12' : 'transparent',
                color: activeTab === 'appointments' ? '#1a202c' : '#cbd5e1'
              }}
            >
              📅 Bookings ({appointments.length})
            </button>
            <button
              onClick={() => { setActiveTab('inquiries'); setSelectedId(null); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === 'inquiries' ? '#6c5ce7' : 'transparent',
                color: activeTab === 'inquiries' ? '#ffffff' : '#cbd5e1'
              }}
            >
              📩 Inquiries ({inquiries.length})
            </button>
          </div>

          <input
            type="text"
            placeholder="Search name, company, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
              background: '#0f141c', color: '#fff', fontSize: '0.85rem', marginBottom: '15px', outline: 'none'
            }}
          />

          <div style={{ maxHeight: '550px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <p style={{ color: '#a0aec0', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>Loading requests...</p>
            ) : filteredList.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>No records found.</p>
            ) : (
              filteredList.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      padding: '14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                      background: isSelected ? 'rgba(243, 156, 18, 0.15)' : '#0f141c',
                      borderLeft: isSelected ? '4px solid #f39c12' : '4px solid transparent',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{item.timestamp?.split(',')[0]}</span>
                    </div>
                    {item.company && <p style={{ fontSize: '0.78rem', color: '#f39c12', margin: '0 0 4px' }}>{item.company}</p>}
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.eventType}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed View & Action Panel */}
        <div style={{ background: '#1a202c', borderRadius: '12px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {selectedItem ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: '0 0 6px' }}>{selectedItem.name}</h2>
                  <p style={{ color: '#f39c12', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                    {selectedItem.company ? selectedItem.company + ' — ' : ''}{selectedItem.email}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '6px' }}>
                    Received: {selectedItem.timestamp}
                  </span>
                  <select
                    value={selectedItem.status || 'Pending Review'}
                    onChange={e => handleStatusChange(selectedItem.id, e.target.value)}
                    style={{
                      background: '#0f141c', color: '#f39c12', border: '1px solid #f39c12', padding: '6px 12px',
                      borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', outline: 'none'
                    }}
                  >
                    <option value="Pending Review">🟡 Pending Review</option>
                    <option value="Contacted">🔵 Contacted</option>
                    <option value="Contract Sent">🟣 Contract Sent</option>
                    <option value="Deposit Paid">🟢 Deposit Paid</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
              </div>

              <div className="admin-spec-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#0f141c', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#a0aec0', textTransform: 'uppercase' }}>Classification</span>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{selectedItem.eventType}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#a0aec0', textTransform: 'uppercase' }}>Scheduled Date &amp; Time</span>
                  <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#f39c12', fontSize: '0.95rem' }}>
                    {selectedItem.date !== 'N/A' ? `${selectedItem.date} @ ${selectedItem.timeSlot}` : 'General Inquiry'}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Client Specifications &amp; Message
                </h4>
                <div style={{ background: '#0f141c', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f39c12', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  {selectedItem.message}
                </div>
              </div>

              <form onSubmit={handleSendReply} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Send Email Reply to Client
                </h4>
                <textarea
                  rows={4}
                  placeholder={`Write your response to ${selectedItem.name}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                    background: '#0f141c', color: '#fff', fontSize: '0.9rem', outline: 'none', marginBottom: '12px', fontFamily: 'inherit'
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={sendingReply}
                  style={{
                    background: 'linear-gradient(135deg, #f39c12, #e67e22)', color: '#fff', border: 'none',
                    padding: '12px 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                  }}
                >
                  {sendingReply ? 'Sending Email...' : 'Send Official Email Reply ✉️'}
                </button>
                {replySuccess && (
                  <p style={{ color: '#2ecc71', fontSize: '0.85rem', marginTop: '10px', fontWeight: 600 }}>✓ {replySuccess}</p>
                )}
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0' }}>
              <p style={{ fontSize: '1.1rem' }}>Select an appointment or inquiry from the list on the left to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
