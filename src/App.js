import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import GetInvolved from './pages/GetInvolved/GetInvolved';
import VotingEligibility from './pages/VotingEligibility/VotingEligibility';
import RegisterToVote from './pages/RegisterToVote/RegisterToVote';
import AbsenteeBallot from './pages/AbsenteeBallot/AbsenteeBallot';
import PollWorker from './pages/PollWorker/PollWorker';
import ReportIssue from './pages/ReportIssue/ReportIssue';
import FindAPlaceToVote from './pages/FindAPlaceToVote/FindAPlaceToVote';
import ElectionDetails from './pages/ElectionDetails/ElectionDetails';
import ExtendedInformation from './pages/ExtendedInformation/ExtendedInformation';
import CandidateProfile from './pages/CandidateProfile/CandidateProfile';
import CandidateDetail from './pages/CandidateDetail/CandidateDetail';
import Compare from './pages/Compare/Compare';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';

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
        <Route path="/candidate/:id" element={<CandidateDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
