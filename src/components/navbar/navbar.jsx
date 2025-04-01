import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo_light from '../../assets/logo-black.png';
import search_icon_light from '../../assets/search-w.png';

// Function to generate a unique session ID
const generateUserID = () => `User_${Math.floor(Math.random() * 10000)}_${Date.now()}`;

// Retrieve or generate session ID
const getSessionUserId = () => {
  let sessionUserId = sessionStorage.getItem("userId");
  if (!sessionUserId) {
    sessionUserId = generateUserID();
    sessionStorage.setItem("userId", sessionUserId);
  }
  return sessionUserId;
};

const Navbar = ({ toggleSidebar }) => {
  const [userId, setUserId] = useState(getSessionUserId);

  useEffect(() => {
    if (window.gtag) {
      // Set user ID for Google Analytics session
      window.gtag('set', { user_id: userId });

      // Optionally log session_start for more clarity in GA4 DebugView
      window.gtag('event', 'session_start', {
        user_id: userId,
      });
    }
  }, [userId]);

  return (
    <div className='navbar'>
      <button className='toggle-button' onClick={toggleSidebar}>☰</button>

      <div className='header'>
        <h1 className='header-text'>Mrs. Brown's Dashboard</h1>
      </div>

      <div className='search'>
        <input type="search" placeholder='Search' className='search-input' />
        <img src={search_icon_light} alt="Search Icon" className='search-icon' />
      </div>

      <div className='user-id-container'>
        <span className='user-id'>Session ID: {userId}</span>
      </div>
    </div>
  );
};

export default Navbar;
