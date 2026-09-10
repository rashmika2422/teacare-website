import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Premium Corporate Event Organizing | Teacare Events Pvt. Ltd.',
  description: 'Teacare Events Pvt. Ltd. — Sri Lanka\'s premier corporate event catering and hospitality specialists. Executive high teas, corporate buffets, gala dinners, and enterprise event management.',
  keywords: 'corporate events, high tea, catering, Sri Lanka, enterprise events, Teacare',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
import AIChatBot from '../components/AIChatBot';
import ScrollToTop from '../components/ScrollToTop';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <AIChatBot />
        <ScrollToTop />
      </body>
    </html>
  );
}
