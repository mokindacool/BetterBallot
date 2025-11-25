import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <div className="navigation-footer">
            <div className="divider"></div>
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 Better Ballot. All rights reserved.</p>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about_us">About Us</Link></li>
                        <li><Link to="/get_involved">Get Involved</Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default Footer; 