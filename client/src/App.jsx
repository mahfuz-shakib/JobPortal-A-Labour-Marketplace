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
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/post-job" element={
              <ProtectedRoute allowedRoles={['client']}>
                <JobPost />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/posted-jobs" element={
              <ProtectedRoute allowedRoles={['client']}>
                <PostedJobs />
              </ProtectedRoute>
            } />
            <Route path="/incoming-bids" element={
              <ProtectedRoute allowedRoles={['client']}>
                <IncomingBids />
              </ProtectedRoute>
            } />
            <Route path="/incoming-bids/:jobId" element={
              <ProtectedRoute allowedRoles={['client']}>
                <IncomingBids />
              </ProtectedRoute>
            } />
            <Route path="/submitted-bids" element={
              <ProtectedRoute allowedRoles={['worker']}>
                <SubmittedBids />
              </ProtectedRoute>
            } />
            <Route path="/accepted-jobs" element={
              <ProtectedRoute allowedRoles={['worker']}>
                <AcceptedJobs />
              </ProtectedRoute>
            } />
            <Route path="/workers" element={<WorkerDirectory />} />
            <Route path="/worker/:id" element={
              <ProtectedRoute>
                <WorkerProfile />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="/profile-card" element={
              <ProtectedRoute allowedRoles={['worker']}>
                <ProfileCardForm />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
