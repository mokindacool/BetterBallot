import React from 'react';
import './ExtendedInformation.css';

function ExtendedInformation() {
    return (
        <div className="p">
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
    
          <div className="title_header">Extended Information</div>
          <div className="description-container">
            <div className="description">
              <h2>If you're not a citizen</h2>
                    <p>If you're not a citizen, including permanent legal resident, then you can not vote in all Federal and State elections. There may be some local elections that you can vote in and in that case we recommend that you check with your local officials.</p>
                <h2>If you're under the age of 18?</h2>
                    <h4>If you are under the age of 18 but will be 18 by Election Day then you can register to vote in the following states:</h4>
                <ul>
                <li>• Alabama</li>
                <li>• Arizona</li>
                <li>• Arkansas</li>
                <li>• California</li>
                <li>...</li>
                </ul>
                    <h4>In you are 17 and will be 18 by Election Day then the following states will allow you to vote in the primary elections:</h4>
                <ul>
                <li>• Alaska</li>
                <li>• Connecticut</li>
                <li>• Delaware</li>
                <li>• District of Columbia</li>
                <li>...</li>
                </ul>
                <h2>If you're not registered to vote?</h2>
                    <p>If you are not registered to vote by the corresponding voter registration deadline of your state you cannot vote in the upcoming election, unless you are voting in North Dakota. North Dakota does not require voter registration.</p>
                <h2>If you live in a U.S. Territory?</h2>
                    <p>IIf you live in a U.S. territory which include Puerto Rico, Guam, American Samoa, Northern Mariana Islands, U.S. Virgin Islands, Minor Outlying Islands, your ballot will not include a candidate for the presidency. You will not be able to vote for a candidate for president.</p>
                <h2>If you have a mental disability?</h2>
                    <p>Your voting eligibility depends on your state's specific regulations.  In some states, individuals under legal guardianship or who have been declared mentally incapacitated by a court may not be permitted to vote. However, many states have no restrictions based on mental disability alone. We recommend checking with your state's election office for specific rules and to understand your eligibility.</p>
                <h2>If you're a convicted felon?</h2>
                    <p>Depending on your state of conviction your eligibility to vote as a convicted felon changes so select the title that applies to you the best and see where you can vote. All information taken from: https://www.ncsl.org/elections-and-campaigns/felon-voting-rights</p>
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

export default ExtendedInformation;