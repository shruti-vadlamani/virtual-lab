// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to VirtualLab</h1>
          <h2>Learn Science Through Interactive Virtual Experiments</h2>
          <p>
            Experience hands-on learning without physical constraints. Our virtual
            labs provide a safe, accessible, and engaging way to conduct experiments.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose VirtualLab?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Chemistry Experiments</h3>
            <p>Conduct titrations, explore reactions, and learn chemistry principles without chemicals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <p>Study pendulums, mechanics, and physical phenomena with interactive simulations.</p>
            <h3>Physics Experiments</h3>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get real-time guidance and explanations from our intelligent laboratory assistant.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Accessible Anywhere</h3>
            <p>No special equipment needed - just a device with internet access.</p>
          </div>
        </div>
      </section>

      <section className="experiments-preview">
        <h2>Available Experiments</h2>
        <div className="experiment-cards">
          <div className="experiment-card">
            <h3>Acid-Base Titration</h3>
            <p>Learn about pH indicators, equivalence points, and acid-base reactions.</p>
            <Link to="/login" className="experiment-link">Try Experiment</Link>
          </div>
          <div className="experiment-card">
            <h3>Simple Pendulum</h3>
            <p>Discover the relationship between period, length, and gravitational acceleration.</p>
            <Link to="/login" className="experiment-link">Try Experiment</Link>
          </div>
          <div className="experiment-card">
            <h3>Permanganometry</h3>
            <p>Explore redox titrations and learn about permanganate as an oxidizing agent.</p>
            <Link to="/login" className="experiment-link">Try Experiment</Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join VirtualLab today and transform your learning experience!</p>
        <Link to="/register" className="btn btn-large">Create Free Account</Link>
      </section>
    </div>
  );
}

export default Home;