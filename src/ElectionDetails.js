import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ElectionDetails.css';

function ElectionDetails() {
  const location = useLocation();
  const initialAddress = location.state?.address || "";
  const [address, setAddress] = useState(initialAddress);

  const electionDetails = {
    "District 1": {
      elections: [
        {
          office: "City Council District 1 Election",
          description: "Only District 1 voters can elect their City Councilmember.",
          zipcodes: ["94702", "94710"],
          candidates: ["The next election is in November 2026"]
        }
      ]
    },
    "District 2": {
        elections: [
          {
            office: "City Council District 2 Election",
            description: "Only District 2 voters can elect their City Councilmember.",
            zipcodes: ["94702", "94703"],
            candidates: ["Jenny Guarino", "Terry Taplin"]
          }
        ]
      },
    "District 3": {
      elections: [
        {
          office: "City Council District 3 Election",
          description: "Only District 3 voters can elect their City Councilmember.",
          zipcodes: ["94703", "94704"],
          candidates: ["Deborah Matthews", "Ben Bartlett (I)", "John 'Chip' Moore"]
        }
      ]
    },
    "District 4": {
        elections: [
          {
            office: "City Council District 4 Election",
            description: "Only District 4 voters can elect their City Councilmember.",
            zipcodes: ["94702", "94703", "94704"],
            candidates: ["The next election is in November 2026"]
          }
        ]
      },
    "District 5": {
      elections: [
        {
          office: "City Council District 5 Election",
          description: "Only District 5 voters can elect their City Councilmember.",
          zipcodes: ["94707", "94708", "94709"],
          candidates: ["Todd Andrew", "Nilang Gor", "Shoshana O'Keefe"]
        }
      ]
    },
    "District 6": {
      elections: [
        {
          office: "City Council District 6 Election",
          description: "Only District 6 voters can elect their City Councilmember.",
          zipcodes: ["94707", "94708"],
          candidates: ["Brent Blackaby", "Andy Katz"]
        }
      ]
    },
    "District 7": {
      elections: [
        {
          office: "City Council District 7 Election",
          description: "Only District 7 voters can elect their City Councilmember.",
          zipcodes: ["94704", "94705"],
          candidates: ["The next election is in November 2026"]
        }
      ]
    },
    "District 8": {
      elections: [
        {
          office: "City Council District 8 Election",
          description: "Only District 8 voters can elect their City Councilmember.",
          zipcodes: ["94705"],
          candidates: ["The next election is in November 2026"]
        }
      ]
    }
    // Add other districts similarly...
  };

  const additionalElections = [
    {
      office: "Mayor",
      description: "Citywide election for mayor.",
      candidates: ["Logan Bowle", "Sophia Hahn", "Kate Harrison", "Aden Ishii", "Naomi Pete"]
    },
    {
      office: "Rent Board Commissioners",
      description: "At-large elections, where all Berkeley voters can participate.",
      candidates: ["Avery Abaugh", "Xavier Johnson", "Andy Kelley", "Carole Marasovic", "Alfred Twu", "Dominique Walker"]
    },
    {
      office: "School Board Directors",
      description: "At-large elections for school board members.",
      candidates: ["Laura Babitt", "Jen Corn", "Norma J F Harrison", "Abdur Sikher", "Ana Vasudeo"]
    }
  ];

  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (office) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [office]: !prev[office]
    }));
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // Find all districts associated with the given zip code
  const zipCode = address.match(/\d{5}/)?.[0];
  const associatedDistricts = Object.keys(electionDetails).filter(districtKey =>
    electionDetails[districtKey].elections.some(election =>
      election.zipcodes.includes(zipCode)
    )
  );

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
          <a href="/about_us">About Us</a>
          <a href="/get_involved">Get Involved</a>
        </nav>
        <a href="/candidate_profiles" className="link">www.betterballot.com</a>
      </header>

      {/* Address Header/Search Bar */}
      <div className="address-header">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your address or ZIP code"
          />
        </div>
      </div>

      {/* Local Elections Section */}
      <section className="local-election-section">
    <h3 className="local-election-title">Local Election</h3>
    {associatedDistricts.length > 0 ? (
        associatedDistricts.map((district, index) => (
            electionDetails[district].elections.map((election, i) => (
                <div key={`${index}-${i}`} className="election-card">
                    <div className="election-card-content">
                        <button
                            className="dropdown-button"
                            onClick={() => toggleDropdown(election.office)}
                        >
                            {election.office}: {election.description}
                        </button>
                        {dropdownOpen[election.office] && (
                            <ul className="candidates-list">
                                {election.candidates.map((candidate, j) => (
                                    <li key={j} className="candidate-card">
                                        <span className="candidate-label">{candidate}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))
        ))
    ) : ( //Basically means If-else statement in JSX
    <p class="no-election-details">No election details found for the provided address.</p>
    )}
</section>

      {/* Statewide Elections Section */}
        {(zipCode && ["94701", "94702", "94703", "94704", "94705", "94706", "94707", "94708", "94709"].includes(zipCode)) && (
            <section className="statewide-election-section">
                <h3 className="statewide-election-title">Statewide Election</h3>
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
                                        <li key={i} className="candidate-card">
                                            <span className="candidate-label">{candidate}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        )}

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
          <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ElectionDetails;
