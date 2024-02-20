import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Bottombar from '../../Components/Navbar/Bottombar';
import '../../App.css';

function Navigation() {
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div>
        <h1>Navigation</h1>
      </div>
      <div className="bottombar">
        <Bottombar />
      </div>
    </div>
  )
}

export default Navigation;