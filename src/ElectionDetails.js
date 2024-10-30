// ElectionDetails.js with complete election information
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ElectionDetails.css';

function ElectionDetails() {
  // Access the address from useLocation
  const location = useLocation();
  const { address } = location.state || {}; // Extract the address passed from Home.js

  const [dropdownOpen, setDropdownOpen] = useState({});

  // Static data for election details
  const electionDetails = {
    "District 1": {
      elections: [
        "City Council District 1 Election: Only District 1 voters can elect their City Councilmember."
      ],
      zipcodes: ["94702", "94710"],
    },
    "District 2": {
      elections: [
        "City Council District 2 Election: Only District 2 voters can elect their City Councilmember."
      ],
      zipcodes: ["94702", "94703"],
    },
    "District 3": {
      elections: [
        "City Council District 3 Election: Only District 3 voters can elect their City Councilmember."
      ],
      zipcodes: ["94703", "94705"],
    },
    "District 4": {
      elections: [
        "City Council District 4 Election: Only District 4 voters can elect their City Councilmember."
      ],
      zipcodes: ["94702", "94703", "94704"],
    },
    "District 5": {
      elections: [
        "City Council District 5 Election: Only District 5 voters can elect their City Councilmember."
      ],
      zipcodes: ["94707", "94708", "94709"],
    },
    "District 6": {
      elections: [
        "City Council District 6 Election: Only District 6 voters can elect their City Councilmember."
      ],
      zipcodes: ["94707", "94708"],
    },
    "District 7": {
      elections: [
        "City Council District 7 Election: Only District 7 voters can elect their City Councilmember."
      ],
      zipcodes: ["94704", "94705"],
    },
    "District 8": {
      elections: [
        "City Council District 8 Election: Only District 8 voters can elect their City Councilmember."
      ],
      zipcodes: ["94705"],
      candidates: [],

    },
  };

  const additionalElections = [
    {
      office: "Mayor",
      description: "Citywide election for Mayor. All district members can vote.",
      candidates: [
        "Logan Bowle",
        "Sophie Hahn",
        "Kate Harrison",
        "Adena Ishii",
        "Naomi Pete"
      ]
    },
    {
      office: "Rent Board Commissioners",
      description: "At-large election for Rent Board Commissioners. All district members can vote.",
      candidates: [
        "Avery Arbaugh",
        "Xavier Johnson (I)",
        "Andy Kelley (I)",
        "Carole Marasovic",
        "Alfred Twu",
        "Dominique Walker (I)"
      ]
    },
    {
      office: "School Board Directors",
      description: "At-large election for School Board Directors. All district members can vote.",
      candidates: [
        "Laura Babitt (I)",
        "Jen Corn",
        "Norma J F Harrison",
        "Abdur Sikder",
        "Ana Vasudeo (I)"
      ]
    }
  ];

  // Find the district based on the address or zip code
  const district = Object.keys(electionDetails).find(districtKey =>
    electionDetails[districtKey].zipcodes.some(zip => address && address.includes(zip))
  );

  const toggleDropdown = (office) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [office]: !prevState[office],
    }));
  };

  return (
    <><header className="header">
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
      </header><div className="election-details-container">
              <div className="address-header">
                  <h2>Address: {address || "No address provided"}</h2>
              </div>

              {/* Local Elections Section */}
              <section className="local-election-section">
                  <h3>Local Election</h3>
                  {district ? (
                      electionDetails[district].elections.map((election, index) => (
                          <div key={index} className="election-card">
                              <div className="election-card-content">
                                  <button
                                      className="dropdown-button"
                                      onClick={() => toggleDropdown(election)}
                                  >
                                      {election}
                                  </button>
                                  {dropdownOpen[election] && (
                                      <ul className="candidates-list">
                                          {district && additionalElections.filter(e => e.office.includes("City Council District" + district)).flatMap(e => e.candidates).map((candidate, i) => (
                                              <li key={i}>{candidate}</li>
                                          ))}
                                      </ul>
                                  )}
                              </div>
                          </div>
                      ))
                  ) : (
                      <p>No election details found for the provided address.</p>
                  )}
              </section>

              {/* Statewide Elections Section */}
              <section className="statewide-election-section">
                  <h3>Statewide</h3>
                  {additionalElections.map((election, index) => (
                      <div key={index} className="election-card">
                          <div className="election-card-content">
                              <button
                                  className="dropdown-button"
                                  onClick={() => toggleDropdown(election.office)}
                              >
                                  {election.office}: {election.description}
                              </button>
                              {dropdownOpen[election.office] && (
                                  <ul className="candidates-list">
                                      {election.candidates.map((candidate, i) => (
                                          <li key={i}>{candidate}</li>
                                      ))}
                                  </ul>
                              )}
                          </div>
                      </div>
                  ))}
              </section>

              {/* Footer */}
              <footer className="footer">
                  <div className="footer-content">
                      <ul className="footer-links">
                          <li><a href="/">Start Here</a></li>
                          <li><a href="/about_us">About Us</a></li>
                          <li><a href="/civic_duty">Civic Duty</a></li>
                          <li><a href="/get_involved">Get Involved</a></li>
                          <li><a href="/contact_us">Contact Us</a></li>
                          <li><a href="/report_issue">Report An Issue</a></li>
                          <li><a href="/our_data">Our Data</a></li>
                          <li><a href="/press">Press</a></li>
                      </ul>
                      <a href="http://www.ballotbuddy.com" className="footer-link">www.ballotbuddy.com</a>

                  </div>
              </footer>
          </div></>
  );
}

export default ElectionDetails;
