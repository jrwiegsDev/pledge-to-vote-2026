import React, { useState } from 'react';

const SharePledge = () => {
  const [copySuccess, setCopySuccess] = useState('');
  const siteUrl = 'https://pledgetovote2026.com'; // Our placeholder URL
  const shareText = "I've pledged to vote in the 2026 Midterms! Join me and make your voice heard. 🇺🇸";

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