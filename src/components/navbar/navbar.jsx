import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo_light from '../../assets/logo-black.png';
import search_icon_light from '../../assets/search-w.png';

// Generate a unique user ID for tracking
const generateUserID = () => `User_${Math.floor(Math.random() * 10000)}`;

// Google Analytics Event Tracking
const trackEvent = (eventName, eventLabel, userId) => {
  if (window.gtag) {
    window.gtag("event", eventName, {
      event_category: "User Interaction",
      event_label: eventLabel,
      user_id: userId,
    });
  }
};

const Navbar = ({ toggleSidebar }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || generateUserID());

  useEffect(() => {
    localStorage.setItem("userId", userId);
    if (window.gtag) {
      window.gtag('set', { user_id: userId });  // Ensure GA is using the correct user ID
    }
  }, [userId]);

  // Reset user function
  const resetUser = () => {
    const newUserId = generateUserID();
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);

    // Immediately update Google Analytics with new user ID
    if (window.gtag) {
      window.gtag('set', { user_id: newUserId });
    }

    trackEvent("reset_user", "User reset session", newUserId);
    alert(`New user started: ${newUserId}`);
  };

  return (
    <div className='navbar'>
      <button className='toggle-button' onClick={toggleSidebar}>☰</button>
      
      <div className='header'>
        <h1 className='header-text'>Teacher Dashboard</h1>
      </div>

      <div className='search'>
        <input type="search" placeholder='Search' className='search-input' />
        <img src={search_icon_light} alt="Search Icon" className='search-icon' />
      </div>

      {/* Reset User Button inside Navbar */}
      <div className='reset-user-container'>
        <button className='reset-user-button' onClick={resetUser}>
          Reset User
        </button>
        <span className='user-id'>ID: {userId}</span>
      </div>
    </div>
  );
};

export default Navbar;
