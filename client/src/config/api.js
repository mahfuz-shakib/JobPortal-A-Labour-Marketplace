// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOGOUT: 'auth/logout',
  
  // User
  USER_PROFILE: 'user/profile',
  USER_CHANGE_EMAIL: 'user/change-email',
  USER_CHANGE_PASSWORD: 'user/change-password',
  USER_DELETE: 'user/delete',
  USER_WORKERS: 'user/workers',
  USER_WORKER_PROFILE: (id) => `user/worker/${id}`,
  USER_PROFILE_CARD: 'user/profile-card',
  
  // Jobs
  JOBS: 'jobs',
  JOBS_MY: 'jobs/my',
  JOBS_ACCEPTED: 'jobs/accepted',
  JOB_DETAILS: (id) => `jobs/${id}`,
  JOB_STATUS: (id) => `jobs/${id}/status`,
  JOB_WORKER_STATUS: (id) => `jobs/${id}/worker-status`,
  
  // Bids
  BIDS: 'bids',
  BIDS_MY: 'bids/my',
  BIDS_INCOMING: 'bids/incoming',
  BIDS_JOB: (jobId) => `bids/job/${jobId}`,
  BID_STATUS: (bidId) => `bids/${bidId}/status`,
  
  // Reviews
  REVIEWS: 'reviews',
};

export default API_BASE_URL; 