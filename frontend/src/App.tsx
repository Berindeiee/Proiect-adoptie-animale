import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router basename="/" navigator={{}}>
      <Routes>
      </Routes>
    </Router>
  );
}

export default App
