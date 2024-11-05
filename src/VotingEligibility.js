import React, {useState} from "react";
import './Cards.css';

function VotingEligibility() {
    const [citizenAnswer, setCitizenAnswer] = useState(null);
    const [ageAnswer, setAgeAnswer] = useState(null);
    const [registrationAnswer, setRegistrationAnswer] = useState(null);
    const [territoryAnswer, setTerritoryAnswer] = useState(null);
    const [disabilityAnswer, setDisabilityAnswer] = useState(null);
    const [felonyAnswer, setFelonyAnswer] = useState(null);

    const handleAnswerClick = (questionSetter, answer) => {
        questionSetter(answer);
    }
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
                <div className="question-box">
                    <p className="question">Are you a U.S. Citizen?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${citizenAnswer === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setCitizenAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${citizenAnswer === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setCitizenAnswer, 'no')}
                        >No</button>
                    </div>
                </div>

                <div className="question-box">
                    <p className="question">Are you over the age of 18 by the date of the election you are voting in?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${ageAnswer === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setAgeAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${ageAnswer === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setAgeAnswer, 'no')}
                        >No</button>
                    </div>
                </div>

                <div className="question-box">
                    <p className="question">Are you registered to vote in your state?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${registrationAnswer === 'yes' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setRegistrationAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${registrationAnswer === 'no' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setRegistrationAnswer, 'no')}
                        >No</button>
                    </div>
                </div>

                <div className="question-box">
                    <p className="question">Do you live in a U.S. territory (Puerto Rico, Guam, American Samoa, Northern Mariana Islands, U.S. Virgin Islands, Minor Outlying Islands)?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${territoryAnswer === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setTerritoryAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${territoryAnswer === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setTerritoryAnswer, 'no')}
                        >No</button>
                    </div>
                </div>

                <div className="question-box">
                    <p className="question">Do you have a mental disability?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${disabilityAnswer === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setDisabilityAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${disabilityAnswer === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setDisabilityAnswer, 'no')}
                        >No</button>
                    </div>
                </div>

                <div className="question-box">
                    <p className="question">Are you a convicted felon?</p>
                    <div className="button-container">
                        <button
                            className={`yes-button ${felonyAnswer === 'yes' ? 'selected-r' : ''}`}
                            onClick={() => handleAnswerClick(setFelonyAnswer, 'yes')}
                        >Yes</button>
                        <button
                            className={`no-button ${felonyAnswer === 'no' ? 'selected-g' : ''}`}
                            onClick={() => handleAnswerClick(setFelonyAnswer, 'no')}
                        >No</button>
                    </div>
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