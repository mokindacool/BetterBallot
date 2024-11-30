import React, { useState } from 'react';
import './AboutUs.css'; 

function AboutUs() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">BETTER</span>
          <span className="logo-text">BALLOT</span>
        </div>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
        </nav>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
        <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
      </header>
      
    <div className="about-us">
      <h2 className="title">About Us</h2>
      <p className="mission-statement">
        Ballot Buddy is a platform that stems from the idea that all those that are able and willing to have a voice should be able to do so without inconvenience. Our team encompasses engineers, designers, and data scientists that are passionate about creating spaces and tools for more and more voices to be heard.
      </p>

      <p className="mission-statement">
        Recognizing that voters have other people, places, and jobs that rely upon them, we believe that voting and voting effectively should be made as easy as possible. If voting is a civic duty - it should be also be something that anyone that is eligible should be able to do with the smallest amount of friction possible.
      </p>

      <p className="mission-statement">
        The Smart Ballot is our first attempt at making voting a more equitable activity - we provide the scoop on the candidates on your ballot, and leave the voting up to you.
      </p>

      <p className="mission-statement">
        Our goal is to create more tools like the Smart Ballot that allow you to streamline a notoriously tricky yet important task in order to increase voter turnout around the country.
      </p>

      {/* <form className="contact-form">
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" />

        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="message">Message:</label> 

        <textarea id="message" name="message"></textarea>

        <button type="submit" className="submit-button">Submit</button> 

      </form> */}
    </div>

    {/* Footer */}
    <div className="navigation-footer">
        <div className="divider"></div>
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024 Better Ballot. All rights reserved.</p>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about_us">About Us</a></li>
              <li><a href="/get_involved">Get Involved</a></li>
            </ul>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default AboutUs;