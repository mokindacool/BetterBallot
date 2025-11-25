import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Compare.css';

function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, [searchParams]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const candidateIds = searchParams.get('candidates');

      if (!candidateIds) {
        setError('No candidates selected for comparison');
        setLoading(false);
        return;
      }

      const ids = candidateIds.split(',');

      if (ids.length !== 2) {
        setError('Please select exactly 2 candidates to compare');
        setLoading(false);
        return;
      }

      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

      const [candidate1Response, candidate2Response] = await Promise.all([
        fetch(`${BACKEND_URL}/api/candidates/${ids[0]}`),
        fetch(`${BACKEND_URL}/api/candidates/${ids[1]}`)
      ]);

      if (!candidate1Response.ok || !candidate2Response.ok) {
        throw new Error('Failed to fetch candidates');
      }

      const [candidate1, candidate2] = await Promise.all([
        candidate1Response.json(),
        candidate2Response.json()
      ]);

      setCandidates([candidate1, candidate2]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates for comparison');
      setLoading(false);
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
      <div className="compare-page">
        <header className="compare-header">
          <div className="logo">
            <span className="logo-text">BETTER</span>
            <span className="logo-text">BALLOT</span>
          </div>
          <nav className="navbar">
            <a href="/">Home</a>
            <a href="/about_us">About Us</a>
            <a href="/get_involved">Get Involved</a>
            <a href="/candidate_profile">Candidate Profiles</a>
          </nav>
          <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
        </header>

        <div className="compare-loading">
          <div className="loading-spinner"></div>
          <p>Loading comparison...</p>
        </div>

        <footer className="compare-footer">
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

  if (error || !candidates[0] || !candidates[1]) {
    return (
      <div className="compare-page">
        <header className="compare-header">
          <div className="logo">
            <span className="logo-text">BETTER</span>
            <span className="logo-text">BALLOT</span>
          </div>
          <nav className="navbar">
            <a href="/">Home</a>
            <a href="/about_us">About Us</a>
            <a href="/get_involved">Get Involved</a>
            <a href="/candidate_profile">Candidate Profiles</a>
          </nav>
          <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
        </header>

        <div className="compare-error">
          <h2>Comparison Error</h2>
          <p>{error || 'Unable to load candidates for comparison'}</p>
          <button onClick={() => navigate('/candidate_profile')} className="back-button">
            Back to Candidates
          </button>
        </div>

        <footer className="compare-footer">
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
    <div className="compare-page">
      <header className="compare-header">
        <div className="logo">
          <span className="logo-text">BETTER</span>
          <span className="logo-text">BALLOT</span>
        </div>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
          <a href="/candidate_profile">Candidate Profiles</a>
        </nav>
        <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
      </header>

      <main className="compare-main">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back to Candidates
        </button>

        <div className="compare-title">
          <h1>Candidate Comparison</h1>
          <p>Compare policies, experience, and positions side-by-side</p>
        </div>

        <div className="comparison-container">
          {/* Candidate 1 */}
          <div className="compare-candidate">
            <div
              className="compare-party-stripe"
              style={{ background: getPartyColor(candidates[0].party) }}
            ></div>

            <div className="compare-candidate-header">
              <div className="compare-image">
                <div className="compare-placeholder">
                  {candidates[0].name.charAt(0)}
                </div>
              </div>
              <h2>{candidates[0].name}</h2>
              <p className="compare-position">{candidates[0].position}</p>
              <span
                className="compare-party-badge"
                style={{ background: getPartyColor(candidates[0].party) }}
              >
                {candidates[0].party}
              </span>
            </div>

            <div className="compare-section">
              <h3>Biography</h3>
              <p>{candidates[0].biography || 'No biography available'}</p>
            </div>

            {candidates[0].education && candidates[0].education.length > 0 && (
              <div className="compare-section">
                <h3>Education</h3>
                <ul className="compare-list">
                  {candidates[0].education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidates[0].experience && candidates[0].experience.length > 0 && (
              <div className="compare-section">
                <h3>Experience</h3>
                <ul className="compare-list">
                  {candidates[0].experience.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidates[0].endorsements && candidates[0].endorsements.length > 0 && (
              <div className="compare-section">
                <h3>Endorsements</h3>
                <ul className="compare-list">
                  {candidates[0].endorsements.map((endorsement, index) => (
                    <li key={index}>{endorsement}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="compare-section">
              <h3>Policy Positions</h3>
              {candidates[0].policies && candidates[0].policies.length > 0 ? (
                <div className="compare-policies">
                  {candidates[0].policies.map((policy, index) => (
                    <div key={index} className="compare-policy-item">
                      <div className="policy-header">
                        <h4>{policy.title}</h4>
                        <span className="policy-priority">
                          Priority: {policy.priority}%
                        </span>
                      </div>
                      <p>{policy.description}</p>
                      <div className="policy-bar">
                        <div
                          className="policy-bar-fill"
                          style={{
                            width: `${policy.priority}%`,
                            background: getPartyColor(candidates[0].party)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No policy information available</p>
              )}
            </div>

            {candidates[0].socialMedia && Object.values(candidates[0].socialMedia).some(v => v) && (
              <div className="compare-section">
                <h3>Connect</h3>
                <div className="compare-social">
                  {candidates[0].socialMedia.website && (
                    <a
                      href={candidates[0].socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      🌐 Website
                    </a>
                  )}
                  {candidates[0].socialMedia.email && (
                    <a
                      href={`mailto:${candidates[0].socialMedia.email}`}
                      className="social-link"
                    >
                      ✉️ Email
                    </a>
                  )}
                  {candidates[0].socialMedia.twitter && (
                    <a
                      href={candidates[0].socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      🐦 Twitter
                    </a>
                  )}
                  {candidates[0].socialMedia.facebook && (
                    <a
                      href={candidates[0].socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      📘 Facebook
                    </a>
                  )}
                  {candidates[0].socialMedia.instagram && (
                    <a
                      href={candidates[0].socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      📷 Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="comparison-divider"></div>

          {/* Candidate 2 */}
          <div className="compare-candidate">
            <div
              className="compare-party-stripe"
              style={{ background: getPartyColor(candidates[1].party) }}
            ></div>

            <div className="compare-candidate-header">
              <div className="compare-image">
                <div className="compare-placeholder">
                  {candidates[1].name.charAt(0)}
                </div>
              </div>
              <h2>{candidates[1].name}</h2>
              <p className="compare-position">{candidates[1].position}</p>
              <span
                className="compare-party-badge"
                style={{ background: getPartyColor(candidates[1].party) }}
              >
                {candidates[1].party}
              </span>
            </div>

            <div className="compare-section">
              <h3>Biography</h3>
              <p>{candidates[1].biography || 'No biography available'}</p>
            </div>

            {candidates[1].education && candidates[1].education.length > 0 && (
              <div className="compare-section">
                <h3>Education</h3>
                <ul className="compare-list">
                  {candidates[1].education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidates[1].experience && candidates[1].experience.length > 0 && (
              <div className="compare-section">
                <h3>Experience</h3>
                <ul className="compare-list">
                  {candidates[1].experience.map((exp, index) => (
                    <li key={index}>{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidates[1].endorsements && candidates[1].endorsements.length > 0 && (
              <div className="compare-section">
                <h3>Endorsements</h3>
                <ul className="compare-list">
                  {candidates[1].endorsements.map((endorsement, index) => (
                    <li key={index}>{endorsement}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="compare-section">
              <h3>Policy Positions</h3>
              {candidates[1].policies && candidates[1].policies.length > 0 ? (
                <div className="compare-policies">
                  {candidates[1].policies.map((policy, index) => (
                    <div key={index} className="compare-policy-item">
                      <div className="policy-header">
                        <h4>{policy.title}</h4>
                        <span className="policy-priority">
                          Priority: {policy.priority}%
                        </span>
                      </div>
                      <p>{policy.description}</p>
                      <div className="policy-bar">
                        <div
                          className="policy-bar-fill"
                          style={{
                            width: `${policy.priority}%`,
                            background: getPartyColor(candidates[1].party)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No policy information available</p>
              )}
            </div>

            {candidates[1].socialMedia && Object.values(candidates[1].socialMedia).some(v => v) && (
              <div className="compare-section">
                <h3>Connect</h3>
                <div className="compare-social">
                  {candidates[1].socialMedia.website && (
                    <a
                      href={candidates[1].socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      🌐 Website
                    </a>
                  )}
                  {candidates[1].socialMedia.email && (
                    <a
                      href={`mailto:${candidates[1].socialMedia.email}`}
                      className="social-link"
                    >
                      ✉️ Email
                    </a>
                  )}
                  {candidates[1].socialMedia.twitter && (
                    <a
                      href={candidates[1].socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      🐦 Twitter
                    </a>
                  )}
                  {candidates[1].socialMedia.facebook && (
                    <a
                      href={candidates[1].socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      📘 Facebook
                    </a>
                  )}
                  {candidates[1].socialMedia.instagram && (
                    <a
                      href={candidates[1].socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      📷 Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="compare-footer">
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

export default Compare;
