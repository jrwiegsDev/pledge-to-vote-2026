// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <p>&copy; 2025 jrSWiEgs. A personal project for skill development.</p>
      <nav>
        <Link to="/privacy-policy">Privacy Policy & Terms of Use</Link>
      </nav>
    </footer>
  );
};

export default Footer;