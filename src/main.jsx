// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import React Router components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx'; // 2. Import policy page

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap everything in BrowserRouter */}
    <BrowserRouter>
      {/* 4. Define the routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);