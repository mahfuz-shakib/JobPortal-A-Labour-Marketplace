import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import JobList from './pages/JobList';
import JobPost from './pages/JobPost';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PostedJobs from './pages/PostedJobs';
import IncomingBids from './pages/IncomingBids';
import SubmittedBids from './pages/SubmittedBids';
import AcceptedJobs from './pages/AcceptedJobs';
import WorkerDirectory from './pages/WorkerDirectory';
import WorkerProfile from './pages/WorkerProfile';
import JobDetails from './pages/JobDetails';
import ProfileCardForm from './pages/ProfileCardForm';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/post-job" element={<JobPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/posted-jobs" element={<PostedJobs />} />
            <Route path="/incoming-bids" element={<IncomingBids />} />
            <Route path="/incoming-bids/:jobId" element={<IncomingBids />} />
            <Route path="/submitted-bids" element={<SubmittedBids />} />
            <Route path="/accepted-jobs" element={<AcceptedJobs />} />
            <Route path="/workers" element={<WorkerDirectory />} />
            <Route path="/worker/:id" element={<WorkerProfile />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/profile-card" element={<ProfileCardForm />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
