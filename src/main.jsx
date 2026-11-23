// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';
import './index.css';

// Deteksi otomatis apakah aplikasi berada di subfolder /web-project-s3 (Laragon localhost)
const basename = window.location.pathname.startsWith('/web-project-s3')
  ? '/web-project-s3'
  : '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
