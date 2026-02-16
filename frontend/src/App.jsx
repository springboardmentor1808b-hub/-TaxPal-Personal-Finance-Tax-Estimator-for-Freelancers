import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/pages/Login'
import Register from './components/pages/Register' 
function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route path="/" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App