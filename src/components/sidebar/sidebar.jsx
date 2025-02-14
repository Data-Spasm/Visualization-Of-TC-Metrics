import React from 'react'
import './sidebar.css'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul className='sidebar-links'>
        <li className='sidebar-item'>Classroom</li>
        <li className='sidebar-item'>Students</li>
        <li className='sidebar-item'>Passages</li>
        <li className='sidebar-item'>Calendar</li>
      </ul>
    </div>
  )
}

export default Sidebar