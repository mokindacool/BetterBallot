import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AboutUs from './AboutUs'; 
import ElectionDetails from './ElectionDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/about_us' element={<AboutUs />} />
        <Route path="/election-details" element={<ElectionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
