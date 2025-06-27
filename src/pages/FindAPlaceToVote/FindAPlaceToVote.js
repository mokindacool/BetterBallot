import React from 'react';
import '../../components/Cards/Cards.css';

function FindAPlaceToVote() {
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

      <div className="title_header">Find a Place to Vote</div>
      <div className="description-container">
        <div className="description">
          In Progress
        </div>
      </div>

      {/* Footer */}
      <div className="o">
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

export default FindAPlaceToVote;