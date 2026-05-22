import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export const metadata = {
  title: 'IdeaVault — A Quiet Place for Loud Ideas',
  description:
    'A reading room for startup ideas. Share, browse, and refine concepts together — without the noise.',
  keywords: ['startup', 'ideas', 'innovation', 'entrepreneurship', 'community'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="ideavaultlight">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-display: 'Fraunces', Georgia, serif;
            --font-body: 'Inter', system-ui, sans-serif;
            --font-mono: 'JetBrains Mono', ui-monospace, monospace;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-base-100 text-base-content flex flex-col font-body antialiased">
       <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
