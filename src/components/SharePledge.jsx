import React, { useState } from 'react';
import './SharePledge.css'; // Assuming you have styling for the new elements

// NEW: The component now accepts the `pledgedState` prop from App.jsx
const SharePledge = ({ pledgedState }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const siteUrl = 'https://pledgetovote2026.com';
  const shareText = "I've pledged to vote in the 2026 Midterms! Join me and make your voice heard. 🇺🇸";

  // NEW: We construct the dynamic URL for the shareable image
  const dynamicImageUrl = `https://pledge-to-vote-2026-backend.onrender.com/api/share/image/${pledgedState}.png`;

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopySuccess('Link Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy.');
    });
  };

  return (
    <div className="share-container">
      <h3>Thank You for Pledging!</h3>
      <p>Now, help spread the word by sharing with your friends and family!</p>

      {/* NEW: This section displays the personalized image */}
      {pledgedState && (
        <div className="share-image-container">
          <img 
            src={dynamicImageUrl} 
            alt={`I pledged to vote in ${pledgedState}!`} 
            className="share-image"
          />
        </div>
      )}

      <div className="share-link-wrapper">
        <input type="text" value={siteUrl} readOnly />
        <button onClick={handleCopy}>
          {copySuccess ? copySuccess : 'Copy Link'}
        </button>
      </div>

      <div className="social-share">
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${siteUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="share-button twitter"
        >
          Share on X
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button facebook"
        >
          Share on Facebook
        </a>
      </div>
    </div>
  );
};

export default SharePledge;