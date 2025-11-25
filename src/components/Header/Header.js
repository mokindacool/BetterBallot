import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <span className="logo-text">BETTER</span>
                <span className="logo-text">BALLOT</span>
            </div>
            <nav className="navbar">
                <Link to="/">Home</Link>
                <Link to="/about_us">About Us</Link>
                <Link to="/get_involved">Get Involved</Link>
                <Link to="/candidate_profile">Candidate Profiles</Link>
            </nav>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
            <a href="https://www.betterballot.info" className="link" target="_blank" rel="noopener noreferrer">www.betterballot.info</a>
        </header>
    );
}

export default Header; 