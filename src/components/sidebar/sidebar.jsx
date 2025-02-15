import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul className='sidebar-links'>
        <li className='sidebar-item'><Link to="/classroom">Classroom</Link></li>
        <li className='sidebar-item'><Link to="/students">Students</Link></li>
        <li className='sidebar-item'><Link to="/students">Passages</Link></li>
        <li className='sidebar-item'><Link to="/students">Calendar</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar