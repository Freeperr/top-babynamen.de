import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'top-babynamen.de – Schöne Babynamen entdecken & finden',
  description:
    'Finde den perfekten Namen für dein Baby. Zeitlose Klassiker, moderne Lieblinge und seltene Namen mit Herkunft, Bedeutung und spielerischem Namensfinder.',
  keywords: [
    'Babynamen',
    'Mädchennamen',
    'Jungennamen',
    'Beliebte Babynamen',
    'Seltene Namen',
    'Namensfinder',
  ],
  authors: [{ name: 'top-babynamen.de' }],
  openGraph: {
    title: 'top-babynamen.de – Finde einen Namen, den du lieben wirst',
    description:
      'Entdecke beliebte, seltene und besondere Babynamen – liebevoll kuratiert und spielerisch inspiriert.',
    url: 'https://top-babynamen.de',
    siteName: 'top-babynamen.de',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${plusJakarta.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#171717] font-sans">
        <FavoritesProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  );
}
