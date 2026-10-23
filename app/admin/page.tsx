'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface FeedbackItem {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  status: 'Pending Review' | 'Published';
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'appointments' | 'inquiries' | 'feedback'>('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/session')
      .then(async (response) => {
        setIsAuthenticated(response.ok);
        if (response.status === 503) {
          const result = await response.json();
          setLoginError(result.error || 'Admin login is not configured on the server.');
        }
      })
      .catch((error) => {
        console.error('Failed to check admin session:', error);
        setLoginError('Could not reach the admin service. Check that the backend is running.');
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Could not sign in.');
      }
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Could not sign in.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Could not end admin session.');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to end admin session:', error);
      setLoginError(error instanceof Error ? error.message : 'Could not end admin session.');
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoginError('Your admin session expired. Please sign in again.');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        throw new Error('Could not load appointments and inquiries.');
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback/admin');
      if (response.status === 401) {
        setIsAuthenticated(false);
        setLoginError('Your admin session expired. Please sign in again.');
        return;
      }
      if (!response.ok) throw new Error('Could not load feedback.');
      setFeedback(await response.json());
      setFeedbackMessage('');
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      setFeedbackMessage(error instanceof Error ? error.message : 'Could not load feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const refresh = () => {
        fetchItems();
        fetchFeedback();
      };
      const initialFetch = setTimeout(refresh, 0);
      const interval = setInterval(refresh, 5000);
      return () => {
        clearTimeout(initialFetch);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  if (!authChecked) {
    return <div style={{ minHeight: '100vh', background: '#0f141c', color: '#cbd5e1', display: 'grid', placeItems: 'center' }}>Checking admin session...</div>;
  }

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
            Sign in to manage bookings, inquiries, and client feedback.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Admin username"
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
              placeholder="Admin password"
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
            <Link href="/" style={{ color: '#a0aec0', fontSize: '0.8rem', textDecoration: 'none' }}>
              ← Return to Public Website
            </Link>
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
  const filteredFeedback = feedback.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });
  const selectedFeedback =
    feedback.find(item => item.id === selectedFeedbackId) || filteredFeedback[0] || null;

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
          subject: `Re: ${selectedItem.eventType} - Teacare Services Pvt Ltd`,
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
    } catch {
      alert('Error sending reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleFeedbackStatus = async (item: FeedbackItem) => {
    const newStatus = item.status === 'Published' ? 'Pending Review' : 'Published';
    setFeedbackBusy(true);
    setFeedbackMessage('');
    try {
      const response = await fetch(`/api/feedback/admin/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Could not update feedback status.');
      }
      setFeedback(prev => prev.map(feedbackItem => feedbackItem.id === item.id ? result.item : feedbackItem));
      setFeedbackMessage(newStatus === 'Published' ? 'Feedback published on the website.' : 'Feedback unpublished.');
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : 'Could not update feedback status.');
    } finally {
      setFeedbackBusy(false);
    }
  };

  const handleDeleteFeedback = async (item: FeedbackItem) => {
    if (!window.confirm(`Permanently delete feedback from ${item.name}?`)) return;

    setFeedbackBusy(true);
    setFeedbackMessage('');
    try {
      const response = await fetch(`/api/feedback/admin/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Could not delete feedback.');
      }
      setFeedback(prev => prev.filter(feedbackItem => feedbackItem.id !== item.id));
      setSelectedFeedbackId(null);
      setFeedbackMessage('Feedback deleted.');
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : 'Could not delete feedback.');
    } finally {
      setFeedbackBusy(false);
    }
  };

  return (
    <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#0f141c', color: '#f7fafc', fontFamily: 'Poppins, sans-serif', padding: '20px 40px' }}>
      {/* Top Header */}
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#f39c12', margin: 0 }}>
            Teacare Services Pvt Ltd Executive Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '4px 0 0' }}>
            Real-time Appointment &amp; Inquiry Operations Console
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/" style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '8px 18px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
            ← Main Site
          </Link>
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
        <div style={{ background: '#1a202c', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8ed7a1', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px' }}>Client Feedback</span>
          <h2 style={{ fontSize: '2rem', margin: '6px 0 0', color: '#ffffff' }}>{feedback.length}</h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Column: Navigation & List */}
        <div style={{ background: '#1a202c', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setActiveTab('appointments'); setSelectedId(null); setSearchQuery(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === 'appointments' ? '#f39c12' : 'transparent',
                color: activeTab === 'appointments' ? '#1a202c' : '#cbd5e1'
              }}
            >
              📅 Bookings ({appointments.length})
            </button>
            <button
              onClick={() => { setActiveTab('inquiries'); setSelectedId(null); setSearchQuery(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === 'inquiries' ? '#6c5ce7' : 'transparent',
                color: activeTab === 'inquiries' ? '#ffffff' : '#cbd5e1'
              }}
            >
              📩 Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => { setActiveTab('feedback'); setSelectedFeedbackId(null); setSearchQuery(''); setFeedbackMessage(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeTab === 'feedback' ? '#8ed7a1' : 'transparent',
                color: activeTab === 'feedback' ? '#1a202c' : '#cbd5e1'
              }}
            >
              ⭐ Feedback ({feedback.length})
            </button>
          </div>

          <input
            type="text"
            placeholder={activeTab === 'feedback' ? 'Search feedback, name, or email...' : 'Search name, company, email...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
              background: '#0f141c', color: '#fff', fontSize: '0.85rem', marginBottom: '15px', outline: 'none'
            }}
          />

          <div style={{ maxHeight: '550px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeTab === 'feedback' ? (
              feedbackLoading ? (
                <p style={{ color: '#a0aec0', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>Loading feedback...</p>
              ) : feedbackMessage && feedback.length === 0 ? (
                <p style={{ color: '#ffb4a9', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>{feedbackMessage}</p>
              ) : filteredFeedback.length === 0 ? (
                <p style={{ color: '#a0aec0', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>No feedback found.</p>
              ) : (
                filteredFeedback.map(item => {
                  const isSelected = selectedFeedback?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedFeedbackId(item.id)}
                      style={{
                        padding: '14px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                        background: isSelected ? 'rgba(243, 156, 18, 0.15)' : '#0f141c',
                        border: `1px solid ${isSelected ? 'rgba(243,156,18,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        color: '#fff',
                      }}
                    >
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                        <strong>{item.name}</strong>
                        <span style={{ color: item.status === 'Published' ? '#8ed7a1' : '#f1c40f', fontSize: '0.75rem' }}>
                          {item.status}
                        </span>
                      </span>
                      <span style={{ display: 'block', color: '#f39c12', margin: '6px 0', letterSpacing: '2px' }}>
                        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                      </span>
                      <span style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.message}
                      </span>
                    </button>
                  );
                })
              )
            ) : loading ? (
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
          {activeTab === 'feedback' ? (
            selectedFeedback ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: '0 0 6px' }}>{selectedFeedback.name}</h2>
                    <a href={`mailto:${selectedFeedback.email}`} style={{ color: '#f39c12', fontSize: '0.9rem', fontWeight: 600 }}>
                      {selectedFeedback.email}
                    </a>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a0aec0', display: 'block', marginBottom: '6px' }}>
                      Received: {new Date(selectedFeedback.timestamp).toLocaleString()}
                    </span>
                    <span style={{ color: selectedFeedback.status === 'Published' ? '#8ed7a1' : '#f1c40f', fontSize: '0.85rem', fontWeight: 600 }}>
                      {selectedFeedback.status}
                    </span>
                  </div>
                </div>
                <p style={{ color: '#f39c12', fontSize: '1.4rem', letterSpacing: '3px', margin: '0 0 18px' }} aria-label={`${selectedFeedback.rating} out of 5 stars`}>
                  {'★'.repeat(selectedFeedback.rating)}{'☆'.repeat(5 - selectedFeedback.rating)}
                </p>
                <div style={{ background: '#0f141c', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f39c12', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '24px' }}>
                  {selectedFeedback.message}
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleFeedbackStatus(selectedFeedback)}
                    disabled={feedbackBusy}
                    style={{ background: selectedFeedback.status === 'Published' ? '#6c5ce7' : 'linear-gradient(135deg, #f39c12, #e67e22)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 700, cursor: feedbackBusy ? 'wait' : 'pointer', opacity: feedbackBusy ? 0.7 : 1 }}
                  >
                    {selectedFeedback.status === 'Published' ? 'Unpublish Feedback' : 'Publish Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeedback(selectedFeedback)}
                    disabled={feedbackBusy}
                    style={{ background: 'rgba(231, 76, 60, 0.18)', color: '#ff8b80', border: '1px solid rgba(231, 76, 60, 0.45)', padding: '12px 20px', borderRadius: '6px', fontWeight: 700, cursor: feedbackBusy ? 'wait' : 'pointer', opacity: feedbackBusy ? 0.7 : 1 }}
                  >
                    Delete Feedback
                  </button>
                </div>
                {feedbackMessage && (
                  <p role="status" style={{ color: feedbackMessage.includes('Could not') ? '#ffb4a9' : '#8ed7a1', fontSize: '0.9rem', marginTop: '14px' }}>
                    {feedbackMessage}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0' }}>
                <p style={{ fontSize: '1.1rem' }}>{feedbackLoading ? 'Loading feedback...' : 'Select feedback from the list to review it.'}</p>
              </div>
            )
          ) : selectedItem ? (
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
