// src/pages/Contact.js
import React, { useState } from 'react';
import '../styles/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    console.log('Form submitted:', formData);
    
    // For demo purposes, just show success message
    setFormSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We'd love to hear from you!</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <div className="contact-method">
            <h3>Email</h3>
            <p>info@virtuallab-example.com</p>
          </div>
          <div className="contact-method">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
          <div className="contact-method">
            <h3>Office Hours</h3>
            <p>Monday - Friday: 9AM - 5PM</p>
          </div>
        </div>

        <div className="contact-form-container">
          {formSubmitted ? (
            <div className="form-success-message">
              <h2>Thank you for contacting us!</h2>
              <p>We've received your message and will get back to you soon.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setFormSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contact;