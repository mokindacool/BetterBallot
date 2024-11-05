import React from 'react';
import './Cards.css';

function ReportIssue() {
  return (
    <div className="palette-2-design-variation">
      {/* Navigation */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">BALLOT</span>
          <span className="logo-text">BUDDY</span>
        </div>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
        </nav>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
        <a href="https://www.betterballot.info" className="link">www.ballotbuddy.info</a>
      </header>

      <div className="title_header">Report an Issue</div>

      <form action="/url" method="GET">
        <p className="form-descriptions">Name</p>
        <div className="input-container">
          <input type="text" name="first_name" placeholder="First Name*" required />
          <input type="text" name="last_name" placeholder="Last Name*" required />
          <input type="text" name="middle_name" placeholder="Middle Name" />
        </div>

        <p className="form-descriptions">Type of Issue</p>
        <div className="input-container">
          <input type="text" name="issue" placeholder="Please Tell Us What is the Issue" required />
        </div>

        <p className="form-descriptions">Please Describe the Issue You are Facing:</p>
        <div className="input-container">
          <textarea className="message_box" name="message" placeholder="Message" required></textarea>
        </div>

        <div className="submit-button-container">
          <input className="submit_button" type="submit" value="Submit" />
        </div>
      </form>

      {/* Footer */}
      <div className="navigation-footer">
        <div className="divider"></div>
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024 Ballot Buddy. All rights reserved.</p>
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

export default ReportIssue;