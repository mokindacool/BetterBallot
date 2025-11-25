// Home.js with integrated address autocomplete and navigation to ElectionDetails
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// Get backend URL from environment variable with fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

function Home() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const debounceTimerRef = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Debounced fetch function
  const fetchAutocompleteSuggestions = useCallback(async (userInput) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError("");

    try {
      const encodedInput = encodeURIComponent(userInput);
      const response = await fetch(
        `${BACKEND_URL}/autocomplete?input=${encodedInput}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      // Don't show error for aborted requests
      if (err.name !== 'AbortError') {
        console.error('Error fetching autocomplete suggestions:', err);
        setError("Unable to fetch suggestions. Please try again.");
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setInput(userInput);
    setSelectedIndex(-1);
    setError("");

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (userInput.length >= 3) {
      // Debounce the API call by 300ms
      debounceTimerRef.current = setTimeout(() => {
        fetchAutocompleteSuggestions(userInput);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    if (input.trim()) {
      navigate('/election-details', { state: { address: input.trim() } });
    } else {
      setError("Please enter a valid address or ZIP code");
    }
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (event) => {
    if (suggestions.length === 0) {
      if (event.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="palette-2-design-variation">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <div className="frame">
          <div className="main-container">
            <div className="ballot-buddy">BETTER BALLOT</div>
            <div className="description">Type in your Zip Code and see your localized Smart Ballot</div>
            <div className="input-field-wrapper">
              <div className="input-field-container">
                <input
                  ref={inputRef}
                  name="search_input"
                  id="search_input"
                  type="text"
                  className="input-field"
                  placeholder="ZIP Code or Address"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  aria-label="Enter your ZIP code or address"
                  aria-autocomplete="list"
                  aria-controls="autocomplete-results"
                  aria-expanded={suggestions.length > 0}
                  aria-activedescendant={
                    selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
                  }
                />
                <button
                  className="search-button"
                  onClick={handleSearch}
                  aria-label="Search for election information"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Search'}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="autocomplete-results"
                  className="autocomplete-results"
                  role="listbox"
                  aria-label="Address suggestions"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.place_id || `suggestion-${index}`}
                      id={`suggestion-${index}`}
                      className={`suggestion ${selectedIndex === index ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Headings */}
        <div className="heading-container">
          <div className="heading">BEFORE THE POLLS</div>
          <div className="subheading">Some Resources To Help You Get to the Polls</div>
        </div>

        {/* Cards */}
        <div className="cards">
          <Link to="/voting_eligibility" className="card voting-eligibility">
            <span className="card-title">Voting Eligibility</span>
          </Link>
          <Link to="/register_to_vote" className="card register-to-vote">
            <span className="card-title">Register to Vote</span>
          </Link>
          <Link to="/absentee_ballot" className="card request-an-absentee-ballot">
            <span className="card-title">Request an Absentee Ballot</span>
          </Link>
        </div>

        <div className="cards">
          <Link to="/poll_worker" className="card become-a-poll-worker">
            <span className="card-title">Become a Poll Worker</span>
          </Link>
          <Link to="/find_a_place_to_vote" className="card find-a-place-to-vote">
            <span className="card-title">Find a Place to Vote</span>
          </Link>
          <Link to="/report_issue" className="card report-an-issue">
            <span className="card-title">Report an Issue</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
