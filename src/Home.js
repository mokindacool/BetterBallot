import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); // Use hook for navigation

  // Function to handle input changes and fetch suggestions
  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setInput(userInput);

    if (userInput.length >= 3) {
      fetchAutocompleteSuggestions(userInput);
    }
  };

  // Fetch autocomplete suggestions from the backend
  const fetchAutocompleteSuggestions = async (userInput) => {
    try {
      const response = await fetch(`http://localhost:5001/autocomplete?input=${userInput}`);
      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle the form submission
  const handleSubmit = () => {
    // Navigate to the election details page and pass the address as state
    navigate('/election-details', { state: { address: input } });
  };

  return (
    <div className="palette-2-design-variation">
      {/* Header */}
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
        <a href="/candidate_profiles" className="link">www.buddy.com</a>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="frame">
          <div className="main-container">
            <div className="ballot-buddy">BALLOT BUDDY</div>
            <div className="description">Type in your Zip Code and see your Smart Ballot</div>
            <div className="input-field-wrapper">
              <div className="input-field-container">
                <input
                  name="search_input"
                  id="search_input"
                  type="text"
                  className="input-field"
                  placeholder="Zip Code"
                  value={input}
                  onChange={handleInputChange}
                />
                <button className="search-button" onClick={handleSubmit}>Search</button>
              </div>
              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <div id="autocomplete-results" className="autocomplete-results">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Headings */}
        <div className="heading-container">
          <div className="heading">BEFORE THE POLLS</div>
          <div className="subheading">Some Resources To Help You Get to the Polls</div>
        </div>

        {/* Cards */}
        <div className="cards">
          <a href="/voting_eligibility" className="card voting-eligibility">
            <span className="card-title">Voting Eligibility</span>
          </a>
          <a href="/register_to_vote" className="card register-to-vote">
            <span className="card-title">Register to Vote</span>
          </a>
          <a href="/absentee_ballot" className="card request-an-absentee-ballot">
            <span className="card-title">Request an Absentee Ballot</span>
          </a>
        </div>

        <div className="cards">
          <a href="/poll_worker" className="card become-a-poll-worker">
            <span className="card-title">Become a Poll Worker</span>
          </a>
          <a href="/find_a_place_to_vote" className="card find-a-place-to-vote">
            <span className="card-title">Find a Place to Vote</span>
          </a>
          <a href="/report_an_issue" className="card report-an-issue">
            <span className="card-title">Report an Issue</span>
          </a>
        </div>
      </main>

      {/* Footer */}
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
  );
}

export default Home;
