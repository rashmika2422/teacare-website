import type { Metadata, Viewport } from 'next';
import './globals.css';

import AIChatBot from '../components/AIChatBot';
import ScrollToTop from '../components/ScrollToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.teacareservices.com'),

  title: {
    default: 'TeaCare Services | Corporate Events & Event Planning Sri Lanka',
    template: '%s | TeaCare Services',
  },

  description:
    'TeaCare Services provides professional corporate event planning, catering, hospitality, executive high teas, corporate buffets, gala dinners and event management services in Sri Lanka.',

  applicationName: 'TeaCare Services',

  authors: [
    {
      name: 'TeaCare Services',
      url: 'https://www.teacareservices.com',
    },
  ],

  creator: 'TeaCare Services',
  publisher: 'TeaCare Services',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://www.teacareservices.com',
    siteName: 'TeaCare Services',

    title: 'TeaCare Services | Corporate Events & Event Planning Sri Lanka',

    description:
      'Professional corporate event planning, catering, hospitality, executive high teas, gala dinners and event management services in Sri Lanka.',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'TeaCare Services | Corporate Events Sri Lanka',

    description:
      'Professional corporate event planning, catering, hospitality and event management services in Sri Lanka.',
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

  keywords: [
    'TeaCare',
    'TeaCare Services',
    'TeaCare Sri Lanka',
    'event planning Sri Lanka',
    'event management Sri Lanka',
    'corporate events Sri Lanka',
    'corporate event planning Sri Lanka',
    'corporate event management',
    'corporate catering Sri Lanka',
    'event catering Sri Lanka',
    'high tea Sri Lanka',
    'corporate high tea',
    'corporate buffet Sri Lanka',
    'gala dinner Sri Lanka',
    'hospitality services Sri Lanka',
    'business events Sri Lanka',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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