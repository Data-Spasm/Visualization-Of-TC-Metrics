import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import Classroom from './views/Classroom'
import Students from './views/Student'
import './App.css'

const App = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  return (
    <Router>
      <div className='container'>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className='main-content'>
          {isSidebarVisible && <Sidebar />}
          <div className={isSidebarVisible ? 'content' : 'content full'}>
            <Routes>
              <Route path="/classroom" element={<Classroom />} />
              <Route path="/students" element={<Students />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App