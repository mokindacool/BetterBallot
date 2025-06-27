import React, { useState } from "react";
import '../../components/Cards/Cards.css';
import { useNavigate } from "react-router-dom";

function VotingEligibility() {
    const [answers, setAnswers] = useState({
        citizen: null,
        age: null,
        registration: null,
        territory: null,
        disability: null,
        felon: null,
    });

    const [dropdownStates, setDropdownStates] = useState({
        citizen: false,
        age: false,
        registration: false,
        territory: false,
        disability: false,
        felon: false,
    });

    const handleAnswerClick = (questionKey, answer, correctAnswer = 'yes') => {
        setAnswers((prev) => ({
            ...prev,
            [questionKey]: answer,
        }));
        setDropdownStates((prev) => ({
            ...prev,
            [questionKey]: answer !== correctAnswer,
        }));
    };

    return (
        <div className="p">
            {/* Navigation */}
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
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"></link>
                <a href="https://www.betterballot.info" className="link">www.betterballot.info</a>
            </header>

            <div className="title_header">Voter Eligibility Quiz</div>

            <div className="quiz-container">
                {/* Question 1 */}
                <div className="question-box">
                    <p className="question">Are you a U.S. Citizen?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.citizen === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('citizen', 'yes')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.citizen === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('citizen', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.citizen && (
                        <div className="dropdown-info cream-background">
                            <p>You are not eligible to vote in U.S. elections. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>

                {/* Question 2 */}
                <div className="question-box" style={{ marginTop: dropdownStates.citizen ? '40px' : '0' }}>
                    <p className="question">Are you over the age of 18 by the date of the election you are voting in?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.age === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('age', 'yes')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.age === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('age', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.age && (
                        <div className="dropdown-info cream-background">
                            <p>You must be 18 or older to vote in most elections. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>

                {/* Question 3 */}
                <div className="question-box" style={{ marginTop: dropdownStates.age ? '40px' : '0' }}>
                    <p className="question">Are you registered to vote in your state?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.registration === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('registration', 'yes')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.registration === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('registration', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.registration && (
                        <div className="dropdown-info cream-background">
                            <p>You must be registered to vote in your state. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>

                {/* Question 4 */}
                <div className="question-box" style={{ marginTop: dropdownStates.registration ? '40px' : '0' }}>
                    <p className="question">Do you live in a U.S. territory (Puerto Rico, Guam, American Samoa, Northern Mariana Islands, U.S. Virgin Islands, Minor Outlying Islands)?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.territory === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('territory', 'yes', 'no')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.territory === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('territory', 'no', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.territory && (
                        <div className="dropdown-info cream-background">
                            <p>Residents of U.S. territories cannot vote in federal elections. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>

                {/* Question 5 */}
                <div className="question-box" style={{ marginTop: dropdownStates.territory ? '40px' : '0' }}>
                    <p className="question">Do you have a mental disability?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.disability === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('disability', 'yes', 'no')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.disability === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('disability', 'no', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.disability && (
                        <div className="dropdown-info cream-background">
                            <p>Eligibility may depend on state laws. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>

                {/* Question 6 */}
                <div className="question-box" style={{ marginTop: dropdownStates.disability ? '40px' : '0' }}>
                    <p className="question">Are you a convicted felon?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${answers.felon === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick('felon', 'yes', 'no')}
                        >
                            Yes
                        </button>
                        <button
                            className={`no-button ${answers.felon === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick('felon', 'no', 'no')}
                        >
                            No
                        </button>
                    </div>
                    {dropdownStates.felon && (
                        <div className="dropdown-info cream-background">
                            <p>Felon voting rights vary by state. Refer to <a href="/extended_info">more info</a>.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
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
        </div>
    );
}

export default VotingEligibility;
