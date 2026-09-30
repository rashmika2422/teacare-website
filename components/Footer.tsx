export default function Footer() {
  const socials = [
    {
      name: 'tiktok',
      url: 'https://www.tiktok.com/@teacareservices.pvt.ltd'
    },
    {
      name: 'instagram',
      url: 'https://www.instagram.com/teacare_service_pvt_ltd'
    },
    {
      name: 'linkedin',
      url: '#'
    },
    {
      name: 'twitter',
      url: '#'
    }
  ];

  return (
    <footer>
      <div className="footer-content">

        <div className="footer-socials">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(243,156,18,0.1)',
                border: '1px solid rgba(243,156,18,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f39c12',
                fontSize: '0.85rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <i className={`fa-brands fa-${social.name}`} />
            </a>
          ))}
        </div>

        <p>
          &copy; {new Date().getFullYear()} Teacare Events Pvt. Ltd. All rights reserved.
        </p>

        <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>
          Executive Corporate Event Planners — Colombo, Sri Lanka
        </p>

      </div>
    </footer>
  );
}