export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-socials">
          {['facebook', 'instagram', 'linkedin', 'twitter'].map(s => (
            <a key={s} href="#" style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f39c12', fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}>
              <i className={`fa-brands fa-${s}`} />
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} Teacare Events Pvt. Ltd. All rights reserved.</p>
        <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>Executive Corporate Event Planners — Colombo, Sri Lanka</p>
      </div>
    </footer>
  );
}
