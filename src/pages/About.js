// src/pages/About.js
import React from 'react';
import '../styles/about.css';

function About() {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1>About VirtualLab</h1>
        <p className="about-tagline">Making science education accessible to everyone, everywhere.</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At VirtualLab, we believe that every student should have access to quality science education
          regardless of their location or resources. Our platform bridges the gap between theoretical knowledge
          and practical experience through interactive, virtual science experiments.
        </p>
        <p>
          We're dedicated to making laboratory learning engaging, safe, and accessible to students worldwide.
          By combining accurate simulations with intelligent guidance, we create an immersive learning environment
          that fosters curiosity and scientific thinking.
        </p>
      </section>

      <section className="about-how-it-works">
        <h2>How It Works</h2>
        <div className="how-it-works-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Register for free to get access to all our virtual experiments.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose an Experiment</h3>
            <p>Browse our catalog of chemistry and physics experiments.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Perform the Experiment</h3>
            <p>Follow the instructions and interact with the virtual laboratory equipment.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Assistance</h3>
            <p>Our AI assistant provides guidance and explanations throughout your experiment.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <p>
          VirtualLab was developed by a team of educators, developers, and scientists passionate about
          improving science education. Our multidisciplinary approach ensures that our simulations are
          both scientifically accurate and pedagogically effective.
        </p>
      </section>

      <section className="about-future">
        <h2>Future Development</h2>
        <p>
          We're continuously working to expand our library of experiments and improve our platform.
          Our roadmap includes more advanced experiments, additional subjects, and enhanced AI capabilities.
          We welcome feedback from educators and students to help shape the future of VirtualLab.
        </p>
      </section>
    </div>
  );
}

export default About;