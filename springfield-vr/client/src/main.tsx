/**
 * Springfield VR Client - Main Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Remove initial loading screen
const initialLoading = document.getElementById('initial-loading');
if (initialLoading) {
  initialLoading.style.display = 'none';
}

// Mount React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
