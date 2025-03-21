import React from 'react';
import '../styles/navbar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">VirtualLab</span>
        <span className="logo-icon">🔬</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;