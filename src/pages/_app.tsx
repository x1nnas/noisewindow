import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Head>
          <meta name="application-name" content="NoiseWindow" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="NoiseWindow" />
          <meta name="description" content="Show your current availability status with beautiful animations" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#2d9d8f" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="NoiseWindow" />
          <meta property="og:description" content="Show your current availability status with beautiful animations" />
          <meta property="og:site_name" content="NoiseWindow" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="NoiseWindow" />
          <meta name="twitter:description" content="Show your current availability status with beautiful animations" />
          
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
          
          <link rel="icon" type="image/png" href="/icons/ios/32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="/icons/ios/64.png" sizes="64x64" />
          <link rel="icon" type="image/png" href="/icons/ios/128.png" sizes="128x128" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          
          {/* iOS Apple Touch Icons */}
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios/180.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios/152.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/icons/ios/167.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/icons/ios/120.png" />
          
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Component {...pageProps} />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
