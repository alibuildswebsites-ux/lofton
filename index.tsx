import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { AuthProvider } from './components/auth/AuthProvider';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <GlobalErrorBoundary>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="lofton-theme">
            <BrowserRouter>
              <App />
              <Analytics />
              <SpeedInsights debug={true} />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </GlobalErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
