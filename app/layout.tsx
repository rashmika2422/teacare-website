import type { Metadata, Viewport } from 'next';
import './globals.css';

import AIChatBot from '../components/AIChatBot';
import ScrollToTop from '../components/ScrollToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.teacareservices.com'),

  title: {
    default:
      'Teacare Service PVT LTD | Corporate Events, Catering & Tea Services Sri Lanka',
    template: '%s | Teacare Service PVT LTD',
  },

  description:
    'Teacare Service PVT LTD provides corporate event organising, event management, corporate catering, executive high tea, tea services, corporate buffets and gala dinners across Sri Lanka.',

  applicationName: 'Teacare Service PVT LTD',

  authors: [
    {
      name: 'Teacare Service PVT LTD',
      url: 'https://www.teacareservices.com',
    },
  ],

  creator: 'Teacare Service PVT LTD',
  publisher: 'Teacare Service PVT LTD',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://www.teacareservices.com',
    siteName: 'Teacare Service PVT LTD',

    title:
      'Teacare Service PVT LTD | Corporate Events, Catering & Tea Services Sri Lanka',

    description:
      'Professional corporate event organising, event management, corporate catering, executive high tea and tea services across Sri Lanka.',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Teacare Service PVT LTD | Corporate Events Sri Lanka',

    description:
      'Corporate event organising, catering, high tea, tea services and event management across Sri Lanka.',
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  category: 'Event Management',

  icons: {
    icon: '/favicon.ico',
  },

  keywords: [
    'Teacare',
    'Teacare Service PVT LTD',
    'Teacare Services',
    'Teacare Sri Lanka',

    'corporate events Sri Lanka',
    'corporate event organiser Sri Lanka',
    'corporate event organizing Sri Lanka',
    'corporate event organising Sri Lanka',

    'event organiser Sri Lanka',
    'event organizing Sri Lanka',
    'event organising Sri Lanka',
    'event planning Sri Lanka',
    'event management Sri Lanka',

    'corporate catering Sri Lanka',
    'event catering Sri Lanka',
    'business catering Sri Lanka',

    'tea services Sri Lanka',
    'corporate tea service Sri Lanka',
    'office tea service Sri Lanka',

    'high tea Sri Lanka',
    'high tea catering Sri Lanka',
    'corporate high tea Sri Lanka',
    'executive high tea Sri Lanka',

    'corporate buffet Sri Lanka',
    'gala dinner Sri Lanka',
    'hospitality services Sri Lanka',
    'business events Sri Lanka',
    'conference catering Sri Lanka',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.teacareservices.com/#organization',

      name: 'Teacare Service PVT LTD',
      legalName: 'Teacare Service PVT LTD',

      url: 'https://www.teacareservices.com',

      description:
        'Professional corporate event organising, catering, high tea and hospitality services in Sri Lanka.',
    },

    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.teacareservices.com/#business',

      name: 'Teacare Service PVT LTD',

      url: 'https://www.teacareservices.com',

      description:
        'Teacare Service PVT LTD provides corporate event organising, event management, corporate catering, executive high tea, tea services, corporate buffets and gala dinners in Sri Lanka.',

      areaServed: {
        '@type': 'Country',
        name: 'Sri Lanka',
      },

      hasOfferCatalog: {
        '@type': 'OfferCatalog',

        name: 'Teacare Service PVT LTD Services',

        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Corporate Event Organising',
              description:
                'Professional corporate event planning and organising services in Sri Lanka.',
            },
          },

          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Event Management',
              description:
                'Professional event management and coordination services in Sri Lanka.',
            },
          },

          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Corporate Catering',
              description:
                'Corporate catering for meetings, conferences, business events and company functions.',
            },
          },

          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Executive High Tea',
              description:
                'Premium executive and corporate high tea catering services.',
            },
          },

          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Tea Services',
              description:
                'Professional tea and refreshment services for corporate events and business functions.',
            },
          },

          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Gala Dinner Catering',
            },
          },
        ],
      },
    },

    {
      '@type': 'WebSite',
      '@id': 'https://www.teacareservices.com/#website',

      url: 'https://www.teacareservices.com/',

      name: 'Teacare Service PVT LTD',

      publisher: {
        '@id': 'https://www.teacareservices.com/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        {children}

        <AIChatBot />
        <ScrollToTop />
      </body>
    </html>
  );
}