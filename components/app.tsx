// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/components/app.tsx
================================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}