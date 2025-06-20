import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className="navigation-footer">
            <div className="divider"></div>
            <footer className="footer">
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

export default Footer; 