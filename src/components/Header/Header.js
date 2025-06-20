import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
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
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
            <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
        </header>
    );
}

export default Header; 