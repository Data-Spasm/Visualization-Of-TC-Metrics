import React from 'react'
import './navbar.css'
import logo_light from '../../assets/logo-black.png'
import search_icon_light from '../../assets/search-w.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo_light} alt="Light Logo" className='logo' />
      <div className='header'>
        <h1 className='header-text'>Teacher Dashboard</h1>
      </div>
      <div className='search'>
        <input type="search" placeholder='Search' className='search-input' />
        <img src={search_icon_light} alt="Search Icon" className='search-icon' />
      </div>
    </div>
  )
}

export default Navbar