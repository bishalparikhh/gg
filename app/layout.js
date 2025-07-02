// app/layout.tsx
'use client';

import Navbar from './components/navbar/navbar';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">

      <body>
        <Auth0Provider>
          <Navbar />
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
