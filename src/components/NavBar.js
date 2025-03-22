// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

function NavBar({ isLoggedIn, onLogout, username }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="logo-text">VirtualLab</span>
          <span className="logo-icon">🔬</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/lab">Lab</Link></li>
            <li>
              <span className="user-greeting">Hello, {username}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;