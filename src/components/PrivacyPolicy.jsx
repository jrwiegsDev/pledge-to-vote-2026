// src/components/PrivacyPolicy.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h1>Privacy Policy & Terms of Service</h1>
      <p><strong>Last Updated: October 12, 2025</strong></p>
      
      <p>Hello! My name is Joe, and I built this website, PledgeToVote2026.com, as a personal project to practice my full-stack development skills and to encourage civic engagement for the 2026 U.S. Midterm Elections. Your privacy is important, and this policy explains what information is collected and how it's used.</p>
      <p>This policy applies only to pledgetovote2026.com.</p>

      <h2>Terms of Use</h2>
      <p>By accessing or using this website, you agree to these simple terms. This site is provided "as-is" for informational and engagement purposes. There are no user accounts, and there is no members-only content.</p>

      <h2>Information Collection</h2>
      <p>My goal is to collect as little information as possible.</p>

      <h3>What I Collect:</h3>
      <p>When you make a pledge, I collect and store only two pieces of non-personally identifiable information:</p>
      <ul>
        <li>Your <strong>State</strong> (as a two-letter abbreviation, e.g., "IL")</li>
        <li>Your <strong>Zip Code</strong> (as a five-digit number)</li>
      </ul>
      <p>This data is used exclusively for the purpose of creating the public pledge tally and the interactive map. The zip code is used to validate that the selected state is correct.</p>

      <h3>What I DO NOT Collect:</h3>
      <p>I do not collect, store, or have access to any personally identifiable information (PII). This includes: Your Name, Your Email Address, Your IP Address in my database, or any demographic or financial information.</p>

      <h3>Automatically Collected Information:</h3>
      <p>Like almost every website on the internet, the hosting service for this site (Render) may automatically collect standard web server logs. This can include your IP address and browser type. This information is used for general traffic analysis and security monitoring. I do not use this data to identify individual users.</p>
      
      <h2>Live User Count</h2>
      <p>To create a sense of a live community, this site includes a counter that displays the number of users currently visiting the page in real-time. This feature works by maintaining a simple, anonymous tally of active connections on the server. It does not track, store, or share any personal information about individual visitors.</p>

      <h2>Data Security & Sharing</h2>
      <p>The limited, anonymous data collected is stored in a secure, cloud-hosted database (MongoDB Atlas). The site uses HTTPS (SSL) to encrypt the connection between your browser and the server.</p>
      <p><strong>I do not sell, trade, or otherwise transfer your information to outside parties because I do not collect any personally identifiable information to begin with.</strong></p>

      <h2>Children's Privacy</h2>
      <p>This site is not directed to children under the age of 13. I do not knowingly collect any information from children under 13.</p>

      <h2>Third-Party Links</h2>
      <p>This site contains links to share content on third-party sites like X and Facebook. I am not responsible for the privacy practices of these other sites.</p>
      <p>Thank you for participating and helping me build my skills!</p>

      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
};

export default PrivacyPolicy;