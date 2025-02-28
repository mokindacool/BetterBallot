import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CandidateProfile.css';

function CandidateProfiles() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('social'); // Default to social tab
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch all candidates on component mount
    fetchCandidates();
  }, []);
  
  useEffect(() => {
    // Check if a specific candidate is requested via state
    if (location.state && location.state.selectedCandidateId && candidates.length > 0) {
      const requestedCandidate = candidates.find(
        candidate => candidate.id === location.state.selectedCandidateId
      );
      
      if (requestedCandidate) {
        setSelectedCandidate(requestedCandidate);
        setActiveTab('social'); // Set to social tab by default when coming from elections
      }
    }
  }, [location.state, candidates]);
  
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // For now, using mock data
      setTimeout(() => {
        const mockCandidates = getMockCandidatesData();
        setCandidates(mockCandidates);
        
        // If a candidate ID is provided in the location state, select that candidate
        if (location.state && location.state.selectedCandidateId) {
          const selectedCand = mockCandidates.find(
            c => c.id === location.state.selectedCandidateId
          );
          
          if (selectedCand) {
            setSelectedCandidate(selectedCand);
            setActiveTab('social'); // Set to social tab when coming from election details
          } else {
            // If the requested candidate is not found, default to the first one
            setSelectedCandidate(mockCandidates[0]);
          }
        } else {
          // No specific candidate requested, default to first one
          if (mockCandidates.length > 0) {
            setSelectedCandidate(mockCandidates[0]);
          }
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };
  
  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    // Keep the active tab when switching candidates
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (loading) {
    return (
      <div className="election-details-container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-text">BETTER</span>
            <span className="logo-text">BALLOT</span>
          </div>
          <nav className="navbar">
            <a href="/">Home</a>
            <a href="/candidate_profile" className="active">Candidate Profiles</a>
            <a href="/about_us">About Us</a>
            <a href="/get_involved">Get Involved</a>
          </nav>
          <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
        </header>
        
        <div className="profiles-loading">
          <div className="loading-spinner"></div>
          <p>Loading candidate profiles...</p>
        </div>
        
        {/* Footer */}
        <div className="navigation-footer">
          <footer className="footer">
            <div className="divider"></div>
            <div className="footer-content">
              <p>&copy; 2024 Better Ballot. All rights reserved.</p>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/candidate_profile">Candidate Profiles</a></li>
                <li><a href="/about_us">About Us</a></li>
                <li><a href="/get_involved">Get Involved</a></li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  
  // Layout that matches first Figma mockup 
  return (
    <div className="election-details-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">BETTER</span>
          <span className="logo-text">BALLOT</span>
        </div>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/candidate_profile" className="active">Candidate Profiles</a>
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
        </nav>
        <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
      </header>
      
      {/* Main Content */}
      <div className="profiles-main-content">
        <h1 className="profiles-heading">Candidate Profiles</h1>
        
        <div className="profiles-container">
          {/* Left Panel - Candidates List */}
          <div className="candidates-sidebar">
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className={`candidate-item ${selectedCandidate && selectedCandidate.id === candidate.id ? 'active' : ''}`}
                  onClick={() => handleCandidateSelect(candidate)}
                >
                  <div className="candidate-item-photo">
                    <div className="candidate-item-placeholder">
                      {candidate.name.charAt(0)}
                    </div>
                  </div>
                  <div className="candidate-item-info">
                    <h3 className="candidate-item-name">{candidate.name}</h3>
                    <p className="candidate-item-position">{candidate.position}</p>
                    <div className="candidate-item-party">
                      {candidate.party}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Panel - Candidate Details */}
          {selectedCandidate ? (
            <div className="candidate-details-panel">
              <div className="candidate-profile-card">
                <div className="candidate-header">
                  <div className="candidate-photo">
                    <div className="placeholder-photo">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                  </div>
                  <div className="candidate-details">
                    <h2 className="candidate-name">{selectedCandidate.name}</h2>
                    <p className="candidate-position">{selectedCandidate.position}</p>
                    <div className="party-tag">
                      {selectedCandidate.party}
                    </div>
                  </div>
                </div>
                
                <div className="candidate-tabs">
                  <button 
                    className={`tab-button ${activeTab === 'information' ? 'active' : ''}`}
                    onClick={() => handleTabChange('information')}
                  >
                    Information
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'policies' ? 'active' : ''}`}
                    onClick={() => handleTabChange('policies')}
                  >
                    Policies
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
                    onClick={() => handleTabChange('social')}
                  >
                    Social
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === 'information' && (
                    <div className="information-tab">
                      {selectedCandidate.biography && (
                        <div className="content-section">
                          <h3 className="section-title">Biography</h3>
                          <p>{selectedCandidate.biography}</p>
                        </div>
                      )}
                      
                      {selectedCandidate.education && selectedCandidate.education.length > 0 && (
                        <div className="content-section">
                          <h3 className="section-title">Education</h3>
                          <ul className="info-list">
                            {selectedCandidate.education.map((edu, index) => (
                              <li key={index}>{edu}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedCandidate.experience && selectedCandidate.experience.length > 0 && (
                        <div className="content-section">
                          <h3 className="section-title">Experience</h3>
                          <ul className="info-list">
                            {selectedCandidate.experience.map((exp, index) => (
                              <li key={index}>{exp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedCandidate.endorsements && selectedCandidate.endorsements.length > 0 && (
                        <div className="content-section">
                          <h3 className="section-title">Endorsements</h3>
                          <ul className="info-list">
                            {selectedCandidate.endorsements.map((endorsement, index) => (
                              <li key={index}>{endorsement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {(!selectedCandidate.biography && 
                        (!selectedCandidate.education || selectedCandidate.education.length === 0) && 
                        (!selectedCandidate.experience || selectedCandidate.experience.length === 0) && 
                        (!selectedCandidate.endorsements || selectedCandidate.endorsements.length === 0)) && (
                        <div className="no-content">
                          <p>No biographical information available for this candidate.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'policies' && (
                    <div className="policies-tab">
                      {selectedCandidate.policies && selectedCandidate.policies.length > 0 ? (
                        selectedCandidate.policies.map((policy, index) => (
                          <div key={index} className="policy-item">
                            <div className="policy-header">
                              <h3 className="policy-title">{policy.title}</h3>
                              <div className="policy-priority">
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill" 
                                    style={{width: `${policy.priority || 0}%`}}
                                  ></div>
                                </div>
                                <span className="priority-label">Priority: {policy.priority || 0}%</span>
                              </div>
                            </div>
                            <p className="policy-description">{policy.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="no-content">
                          <p>No policy information available for this candidate.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'social' && (
                    <div className="social-tab">
                      {selectedCandidate.socialMedia && Object.keys(selectedCandidate.socialMedia || {}).length > 0 ? (
                        <div className="social-content">
                          <h3 className="section-title">Connect with {selectedCandidate.name}</h3>
                          <div className="social-links-container">
                            {selectedCandidate.socialMedia.website && (
                              <a href={selectedCandidate.socialMedia.website} target="_blank" rel="noopener noreferrer" className="social-link">
                                Website
                              </a>
                            )}
                            {selectedCandidate.socialMedia.email && (
                              <a href={`mailto:${selectedCandidate.socialMedia.email}`} className="social-link">
                                Email
                              </a>
                            )}
                            {selectedCandidate.socialMedia.twitter && (
                              <a href={selectedCandidate.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                                Twitter
                              </a>
                            )}
                            {selectedCandidate.socialMedia.facebook && (
                              <a href={selectedCandidate.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                                Facebook
                              </a>
                            )}
                            {selectedCandidate.socialMedia.instagram && (
                              <a href={selectedCandidate.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                                Instagram
                              </a>
                            )}
                          </div>
                          
                          <div className="recent-posts">
                            <h3 className="section-title">Recent Updates</h3>
                            {selectedCandidate.recentPosts && selectedCandidate.recentPosts.length > 0 ? (
                              <div className="posts-container">
                                {selectedCandidate.recentPosts.map((post, index) => (
                                  <div key={index} className="post-card">
                                    <div className="post-header">
                                      <p className="post-date">{post.date}</p>
                                      <p className="post-platform">{post.platform}</p>
                                    </div>
                                    <p className="post-content">{post.content}</p>
                                    {post.link && (
                                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
                                        View Original Post
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No recent posts available.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="no-content">
                          <p>No social media information available for this candidate.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-candidate-selected">
              <p>Please select a candidate from the list to view their profile.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="navigation-footer">
        <footer className="footer">
          <div className="divider"></div>
          <div className="footer-content">
            <p>&copy; 2024 Better Ballot. All rights reserved.</p>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/candidate_profiles">Candidate Profiles</a></li>
              <li><a href="/about_us">About Us</a></li>
              <li><a href="/get_involved">Get Involved</a></li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

function getMockCandidatesData() {
  return [
    {
      id: '1',
      name: 'Kate Harrison',
      position: 'Mayor Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Kate Harrison has served on the Berkeley City Council since 2017, representing Downtown Berkeley and the UC Berkeley campus area in District 4. She has been a strong advocate for affordable housing, climate action, and progressive policies.',
      education: [
        'UC Berkeley, Master of Public Policy',
        'Yale University, BA in Political Science'
      ],
      experience: [
        'Berkeley City Council, District 4 (2017-Present)',
        'Budget and Finance Policy Committee Chair',
        'Public Works Commission (2012-2016)',
        'Senior Analyst, Berkeley City Auditors Office (2008-2012)'
      ],
      endorsements: [
        'Berkeley Progressive Alliance',
        'Berkeley Tenants Union',
        'Sierra Club',
        'Berkeley Citizens Action'
      ],
      policies: [
        {
          title: 'Affordable Housing',
          description: 'Expand affordable housing by requiring higher inclusionary percentages in new developments and protecting existing tenants from displacement.',
          priority: 90
        },
        {
          title: 'Climate Action',
          description: 'Implement Berkeleys Climate Action Plan to achieve carbon neutrality by 2030, including electrification of buildings and transportation.',
          priority: 85
        },
        {
          title: 'Public Safety',
          description: 'Reform police practices and invest in community-based crisis response for mental health emergencies and non-violent incidents.',
          priority: 80
        },
        {
          title: 'Homelessness',
          description: 'Expand shelter capacity and permanent supportive housing while providing comprehensive services to address root causes of homelessness.',
          priority: 95
        }
      ],
      socialMedia: {
        website: 'https://www.kateharrison.info',
        email: 'kate@kateharrison.info',
        twitter: 'https://twitter.com/KateHarrisonD4',
        facebook: 'https://facebook.com/KateHarrisonD4',
        instagram: 'https://instagram.com/KateHarrisonD4'
      },
      recentPosts: [
        {
          date: 'October 12, 2024',
          platform: 'Twitter',
          content: 'Join us this Saturday for our campaign kickoff at Civic Center Park! Well be discussing our vision for Berkeleys future.',
          link: 'https://twitter.com/KateHarrisonD4/status/1447'
        },
        {
          date: 'October 8, 2024',
          platform: 'Facebook',
          content: 'Today the City Council unanimously passed our proposal to expand affordable housing requirements. This is a big win for working families in Berkeley!',
          link: 'https://facebook.com/KateHarrisonD4/posts/2345'
        }
      ]
    },
    {
      id: '2',
      name: 'Terry Taplin',
      position: 'City Council District 2 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Terry Taplin is a poet, community organizer, and transit advocate who has lived in West Berkeley for over 15 years. As a renter and public transit rider, he understands the challenges facing working-class residents.',
      education: [
        'UC Berkeley, BA in English Literature',
        'City College of San Francisco, AA in Humanities'
      ],
      experience: [
        'Berkeley Transportation Commission (2018-2022)',
        'Berkeley Poetry Festival Organizer (2016-2020)',
        'West Berkeley Neighborhood Association Board Member'
      ],
      endorsements: [
        'Berkeley Democratic Club',
        'East Bay Young Democrats',
        'Former Mayor Tom Bates'
      ],
      policies: [
        {
          title: 'Transportation',
          description: 'Improve public transit, expand bike lanes, and create a more walkable West Berkeley with better connections to the waterfront.',
          priority: 90
        },
        {
          title: 'Housing',
          description: 'Increase housing production along transit corridors while protecting existing affordable units and preventing displacement.',
          priority: 85
        }
      ],
      socialMedia: {
        website: 'https://www.terrytaplin.com',
        email: 'info@terrytaplin.com',
        twitter: 'https://twitter.com/TerryTaplin',
        facebook: 'https://facebook.com/TerryTaplinForBerkeley'
      }
    },
    {
      id: '9',
      name: 'Shoshana O\'Keefe',
      position: 'City Council District 5 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Shoshana O\'Keefe is a housing advocate and community organizer focused on affordability and climate action in Berkeley.',
      education: [
        'UC Berkeley, Master in City Planning',
        'Brown University, BA in Urban Studies'
      ],
      experience: [
        'Berkeley Housing Advisory Commission (2019-Present)',
        'Climate Action Coalition Coordinator (2018-2022)',
        'Affordable Housing Developer (2015-Present)'
      ],
      endorsements: [
        'Berkeley Tenants Union',
        'Sierra Club',
        'Berkeley Progressive Alliance'
      ],
      policies: [
        {
          title: 'Affordable Housing',
          description: 'Create more affordable housing for working families, seniors, and students through inclusive zoning and anti-displacement policies.',
          priority: 95
        },
        {
          title: 'Climate Justice',
          description: 'Implement Berkeleys Climate Action Plan with an emphasis on equity and ensuring environmental benefits reach all neighborhoods.',
          priority: 90
        },
        {
          title: 'Transit and Mobility',
          description: 'Improve public transit access, expand bike infrastructure, and make North Berkeley more walkable and accessible.',
          priority: 85
        }
      ],
      socialMedia: {
        website: 'https://www.shoshanaokeefe.org',
        email: 'shoshana@shoshanaokeefe.org',
        twitter: 'https://twitter.com/ShoshanaOKeefe',
        instagram: 'https://instagram.com/shoshana4berkeley',
        facebook: 'https://facebook.com/ShoshanaOKeefeForBerkeley'
      },
      recentPosts: [
        {
          date: 'October 15, 2024',
          platform: 'Instagram',
          content: 'Thanks to everyone who joined our community forum on housing affordability last night! Great discussion on practical solutions for Berkeley.',
          link: 'https://instagram.com/p/shoshana4berkeley/12345'
        },
        {
          date: 'October 10, 2024',
          platform: 'Twitter',
          content: 'Excited to announce our endorsement from the Berkeley Tenants Union! Looking forward to working together to protect renters and expand affordable housing.',
          link: 'https://twitter.com/ShoshanaOKeefe/status/54321'
        }
      ]
    },
    {
      id: '6',
      name: 'Logan Bowle',
      position: 'Mayor Candidate',
      party: 'Independent',
      photoUrl: null,
      biography: 'Logan Bowle is a community organizer and housing advocate with extensive experience working with nonprofit organizations. His campaign focuses on affordable housing solutions and community-led development.',
      socialMedia: {
        website: 'https://www.loganbowle.org',
        email: 'logan@loganbowle.org',
        twitter: 'https://twitter.com/LoganBowle'
      }
    },
    {
      id: '3',
      name: 'Ben Bartlett',
      position: 'City Council District 3 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Ben Bartlett is the incumbent City Councilmember for District 3, representing South Berkeley. A third-generation Berkeley resident, he has focused on affordable housing, environmental justice, and economic opportunity during his first term.',
      socialMedia: {
        website: 'https://www.benbartlett.com',
        email: 'info@benbartlett.com'
      }
    },
    {
      id: '8',
      name: 'Nilang Gor',
      position: 'City Council District 5 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Nilang Gor is a scientist and educator committed to environmental justice and community-led solutions to Berkeleys challenges.',
      socialMedia: {
        website: 'https://www.nilanggor.com',
        email: 'nilang@nilanggor.com',
        facebook: 'https://facebook.com/NilangGorForBerkeley'
      }
    },
    {
      id: '11',
      name: 'Brent Blackaby',
      position: 'City Council District 6 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Brent Blackaby is a nonprofit executive and parent who has lived in Berkeley for over 20 years. He is focused on public safety, supporting local businesses, and improving city services.',
      socialMedia: {
        website: 'https://www.brentblackaby.com',
        email: 'brent@brentblackaby.com',
        facebook: 'https://facebook.com/BlackabyForBerkeley'
      }
    },
    {
      id: '12',
      name: 'Andy Katz',
      position: 'City Council District 6 Candidate',
      party: 'Democrat',
      photoUrl: null,
      biography: 'Andy Katz is an environmental attorney and public health advocate who has served on the East Bay Municipal Utility District Board since 2006. He is focused on infrastructure, climate resilience, and public health.',
      socialMedia: {
        website: 'https://www.andykatz.org',
        email: 'andy@andykatz.org',
        twitter: 'https://twitter.com/AndyKatzBerkeley'
      }
    }
  ];
}

export default CandidateProfiles;