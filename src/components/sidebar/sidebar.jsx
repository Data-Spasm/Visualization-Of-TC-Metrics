import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul className='sidebar-links'>
        <li className='sidebar-item'><Link to="/classroom">Classroom</Link></li>
        <li className='sidebar-item'><Link to="/student-list">Students</Link></li>

        
      </ul>
    </div>
  )
}

export default Sidebar