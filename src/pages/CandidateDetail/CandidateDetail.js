import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CandidateDetail.css';

function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('information');

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      const response = await fetch(`${BACKEND_URL}/api/candidates/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCandidate(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidate:', error);
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
      <div className="detail-page">
        <header className="detail-header">
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

        <div className="detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading candidate details...</p>
        </div>

        <footer className="detail-footer">
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

  if (!candidate) {
    return (
      <div className="detail-page">
        <header className="detail-header">
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

        <div className="detail-error">
          <h2>Candidate Not Found</h2>
          <p>The candidate you're looking for could not be found.</p>
          <button onClick={() => navigate('/candidate_profile')} className="back-button">
            Back to Candidates
          </button>
        </div>

        <footer className="detail-footer">
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
    <div className="detail-page">
      <header className="detail-header">
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

      <main className="detail-main">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back to Candidates
        </button>

        <div className="candidate-detail-container">
          <div
            className="detail-party-stripe"
            style={{ background: getPartyColor(candidate.party) }}
          ></div>

          <div className="detail-header-section">
            <div className="detail-image">
              <div className="detail-placeholder">
                {candidate.name.charAt(0)}
              </div>
            </div>

            <div className="detail-info">
              <h1>{candidate.name}</h1>
              <p className="detail-position">{candidate.position}</p>
              <span
                className="detail-party-badge"
                style={{ background: getPartyColor(candidate.party) }}
              >
                {candidate.party}
              </span>
            </div>
          </div>

          <div className="detail-tabs">
            <button
              className={`detail-tab ${activeTab === 'information' ? 'active' : ''}`}
              onClick={() => setActiveTab('information')}
            >
              Information
            </button>
            <button
              className={`detail-tab ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              Policies
            </button>
            <button
              className={`detail-tab ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              Social Media
            </button>
          </div>

          <div className="detail-content">
            {activeTab === 'information' && (
              <div className="info-content">
                {candidate.biography && (
                  <section className="content-block">
                    <h2>Biography</h2>
                    <p>{candidate.biography}</p>
                  </section>
                )}

                {candidate.education && candidate.education.length > 0 && (
                  <section className="content-block">
                    <h2>Education</h2>
                    <ul className="detail-list">
                      {candidate.education.map((edu, index) => (
                        <li key={index}>{edu}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {candidate.experience && candidate.experience.length > 0 && (
                  <section className="content-block">
                    <h2>Experience</h2>
                    <ul className="detail-list">
                      {candidate.experience.map((exp, index) => (
                        <li key={index}>{exp}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {candidate.endorsements && candidate.endorsements.length > 0 && (
                  <section className="content-block">
                    <h2>Endorsements</h2>
                    <ul className="detail-list">
                      {candidate.endorsements.map((endorsement, index) => (
                        <li key={index}>{endorsement}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="policies-content">
                {candidate.policies && candidate.policies.length > 0 ? (
                  <div className="policies-grid">
                    {candidate.policies.map((policy, index) => (
                      <div key={index} className="policy-card">
                        <div className="policy-card-header">
                          <h3>{policy.title}</h3>
                          <div className="priority-badge">
                            Priority: {policy.priority}%
                          </div>
                        </div>
                        <p>{policy.description}</p>
                        <div className="priority-bar">
                          <div
                            className="priority-fill"
                            style={{
                              width: `${policy.priority}%`,
                              background: getPartyColor(candidate.party)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-content">No policy information available for this candidate.</p>
                )}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="social-content">
                {candidate.socialMedia && Object.values(candidate.socialMedia).some(v => v) ? (
                  <>
                    <section className="content-block">
                      <h2>Connect with {candidate.name}</h2>
                      <div className="social-links">
                        {candidate.socialMedia.website && (
                          <a
                            href={candidate.socialMedia.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link-item"
                          >
                            🌐 Website
                          </a>
                        )}
                        {candidate.socialMedia.email && (
                          <a
                            href={`mailto:${candidate.socialMedia.email}`}
                            className="social-link-item"
                          >
                            ✉️ Email
                          </a>
                        )}
                        {candidate.socialMedia.twitter && (
                          <a
                            href={candidate.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link-item"
                          >
                            🐦 Twitter
                          </a>
                        )}
                        {candidate.socialMedia.facebook && (
                          <a
                            href={candidate.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link-item"
                          >
                            📘 Facebook
                          </a>
                        )}
                        {candidate.socialMedia.instagram && (
                          <a
                            href={candidate.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link-item"
                          >
                            📷 Instagram
                          </a>
                        )}
                      </div>
                    </section>

                    {candidate.recentPosts && candidate.recentPosts.length > 0 && (
                      <section className="content-block">
                        <h2>Recent Updates</h2>
                        <div className="posts-grid">
                          {candidate.recentPosts.map((post, index) => (
                            <div key={index} className="post-item">
                              <div className="post-meta">
                                <span className="post-date">{post.date}</span>
                                <span className="post-platform">{post.platform}</span>
                              </div>
                              <p className="post-text">{post.content}</p>
                              {post.link && (
                                <a
                                  href={post.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="post-link"
                                >
                                  View Post →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <p className="no-content">No social media information available for this candidate.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="detail-footer">
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

export default CandidateDetail;
