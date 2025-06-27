import React, { useState } from 'react';
import '../../components/Cards/Cards.css';

function ReportIssue() {
  const initialFormState = {
    first_name: '',
    last_name: '',
    middle_name: '',
    issue: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission, e.g., send the data to an API
    console.log('Form data submitted:', formData);

    // reset the form
    setFormData(initialFormState);
  };

  return (
    <div className="palette-2-design-variation">
      {/* Navigation */}
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
        <a href="https://www.betterballot.info" className="link">www.ballotbuddy.info</a>
      </header>

      <div className="title_header">Report an Issue</div>

      <form onSubmit={handleSubmit}>
        <p className="form-descriptions">Name</p>
        <div className="input-container">
          <input
            type="text"
            name="first_name"
            placeholder="First Name*"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name*"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="middle_name"
            placeholder="Middle Name"
            value={formData.middle_name}
            onChange={handleChange}
          />
        </div>

        <p className="form-descriptions">Type of Issue</p>
        <div className="input-container">
          <input
            type="text"
            name="issue"
            placeholder="Please Tell Us What is the Issue"
            value={formData.issue}
            onChange={handleChange}
            required
          />
        </div>

        <p className="form-descriptions">Please Describe the Issue You are Facing:</p>
        <div className="input-container">
          <textarea
            className="message_box"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
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
