import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './LiveUserCount.css'; // We'll create this file next

const LiveUserCount = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io('https://pledge-to-vote-2026-backend.onrender.com');

    // Listen for the 'userCountUpdate' event from the server
    socket.on('userCountUpdate', (count) => {
      setUserCount(count);
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="live-user-count">
      <span className="live-dot"></span>
      {userCount} {userCount === 1 ? 'person' : 'people'} currently online
    </div>
  );
};

export default LiveUserCount;