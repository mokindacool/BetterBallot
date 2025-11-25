import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CandidateProfile.css';

function CandidateProfiles() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      const response = await fetch(`${BACKEND_URL}/api/candidates`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedCandidates = await response.json();
      setCandidates(fetchedCandidates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const handleLearnMore = (candidateId) => {
    navigate(`/candidate/${candidateId}`);
  };

  const toggleCompare = (candidateId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        if (prev.length >= 2) {
          alert('You can only compare up to 2 candidates at a time');
          return prev;
        }
        return [...prev, candidateId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      navigate(`/compare?candidates=${selectedForComparison.join(',')}`);
    } else {
      alert('Please select exactly 2 candidates to compare');
    }
  };

  const getPartyColor = (party) => {
    const partyLower = (party || '').toLowerCase();
    if (partyLower.includes('democrat')) return '#01395E';
    if (partyLower.includes('republican')) return '#DC143C';
    if (partyLower.includes('independent')) return '#6c757d';
    return '#28a745';
  };

  if (loading) {
    return (
      <div className="profiles-page">
        <header className="profiles-header">
          <div className="logo">
            <span className="logo-text">BETTER</span>
            <span className="logo-text">BALLOT</span>
          </div>
          <nav className="navbar">
            <a href="/">Home</a>
            <a href="/about_us">About Us</a>
            <a href="/get_involved">Get Involved</a>
            <a href="/candidate_profile" className="active">Candidate Profiles</a>
          </nav>
          <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
        </header>

        <div className="profiles-loading">
          <div className="loading-spinner"></div>
          <p>Loading candidates...</p>
        </div>

        <footer className="profiles-footer">
          <div className="divider"></div>
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

  return (
    <div className="profiles-page">
      <header className="profiles-header">
        <div className="logo">
          <span className="logo-text">BETTER</span>
          <span className="logo-text">BALLOT</span>
        </div>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
          <a href="/candidate_profile" className="active">Candidate Profiles</a>
        </nav>
        <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
      </header>

      <main className="profiles-main">
        <div className="profiles-hero">
          <h1>2025 Election Candidates</h1>
          <p>Review candidate profiles, policy positions, and make informed voting decisions.</p>
        </div>

        {selectedForComparison.length > 0 && (
          <div className="comparison-banner">
            <span>{selectedForComparison.length} candidate(s) selected for comparison</span>
            <div className="comparison-actions">
              {selectedForComparison.length === 2 && (
                <button onClick={handleCompare} className="compare-now-btn">
                  Compare Now
                </button>
              )}
              <button onClick={() => setSelectedForComparison([])} className="clear-selection-btn">
                Clear Selection
              </button>
            </div>
          </div>
        )}

        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-image">
                <div className="image-placeholder">
                  {candidate.name.charAt(0)}
                </div>
              </div>

              <div className="card-header">
                <h2>{candidate.name}</h2>
                <p className="candidate-position">{candidate.position}</p>
                <span
                  className="party-badge"
                  style={{ background: getPartyColor(candidate.party) }}
                >
                  {candidate.party}
                </span>
              </div>

              <div className="policy-highlights">
                <h3>POLICY HIGHLIGHTS</h3>
                <div className="highlights-list">
                  {candidate.policies && candidate.policies.length > 0 ? (
                    candidate.policies.slice(0, 3).map((policy, index) => (
                      <div key={index} className="highlight-item">
                        <div className="highlight-indicator"></div>
                        <div className="highlight-content">
                          <h4>{policy.title}</h4>
                          <p>{policy.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-policies">No policy information available</p>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleLearnMore(candidate.id)}
                  className="learn-more-btn"
                >
                  Learn More
                  <span className="arrow">→</span>
                </button>
                <button
                  onClick={() => toggleCompare(candidate.id)}
                  className={`compare-btn ${selectedForComparison.includes(candidate.id) ? 'selected' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>

        {candidates.length === 0 && !loading && (
          <div className="no-candidates">
            <p>No candidates found</p>
          </div>
        )}
      </main>

      <footer className="profiles-footer">
        <div className="divider"></div>
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

export default CandidateProfiles;
