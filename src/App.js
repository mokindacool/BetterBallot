import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import AboutUs from './AboutUs'; 
import GetInvolved from './GetInvolved';
import VotingEligibility from './VotingEligibility';
import RegisterToVote from './RegisterToVote';
import AbsenteeBallot from './AbsenteeBallot';
import PollWorker from './PollWorker';
import ReportIssue from './ReportIssue';
import FindAPlaceToVote from './FindAPlaceToVote';
import ElectionDetails from './ElectionDetails';
import ExtendedInformation from './ExtendedInformation';
import CandidateProfile from './CandidateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/about_us' element={<AboutUs />} />
        <Route path='/get_involved' element={<GetInvolved />} />
        <Route path='/voting_eligibility' element={<VotingEligibility />} />
        <Route path='/register_to_vote' element={<RegisterToVote />} />
        <Route path='/absentee_ballot' element={<AbsenteeBallot />} />
        <Route path='/poll_worker' element={<PollWorker />} />
        <Route path='/report_issue' element={<ReportIssue />} />
        <Route path='/find_a_place_to_vote' element={<FindAPlaceToVote />} />
        <Route path="/election-details" element={<ElectionDetails />} />
        <Route path="/extended_info" element={<ExtendedInformation />} />
        <Route path="/candidate_profile" element={<CandidateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
