import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import Classroom from './views/Classroom'
import Students from './views/Student'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className='container'>
        <Navbar />
        <div className='main-content'>
          <Sidebar />
          <Routes>
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}


export default App
