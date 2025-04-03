import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo_light from '../../assets/logo-black.png';
import search_icon_light from '../../assets/search-w.png';

// Utility to generate or retrieve consistent session ID
const getSessionUserId = () => {
  let sessionUserId = sessionStorage.getItem("userId");
  if (!sessionUserId) {
    sessionUserId = `User_${Math.floor(Math.random() * 10000)}_${Date.now()}`;
    sessionStorage.setItem("userId", sessionUserId);
  }
  return sessionUserId;
};

const Navbar = ({ toggleSidebar }) => {
  const [userId, setUserId] = useState(getSessionUserId);

  // Optional: Track session start as a custom event once
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'session_start', {
        user_id: userId,
        event_category: 'Session',
        event_label: 'Navbar Initialized'
      });
    }
  }, [userId]);

  return (
    <div className='navbar'>
      <button className='toggle-button' onClick={toggleSidebar}>☰</button>

      <div className='header'>
        <h1 className='header-text'>Mrs. Brown's Dashboard</h1>
      </div>

      <div className='user-id-container'>
        <span className='user-id'>Session ID: {userId}</span>
      </div>
    </div>
  );
};

export default Navbar;
