const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Create job (client only)
router.post('/', authMiddleware, jobController.createJob);
// Get all jobs
router.get('/', jobController.getJobs);

// Get jobs posted by the logged-in client
router.get('/my', authMiddleware, jobController.getMyJobs);
// Get jobs accepted by the logged-in worker
router.get('/accepted', authMiddleware, jobController.getAcceptedJobs);

// Get job by id
router.get('/:id', jobController.getJobById);
// Update job
router.put('/:id', authMiddleware, jobController.updateJob);
// Delete job
router.delete('/:id', authMiddleware, jobController.deleteJob);

// Update job status (client/worker)
router.patch('/:id/status', authMiddleware, jobController.updateJobStatus);
// Worker updates their job status (start work, update progress, complete)
router.patch('/:id/worker-status', authMiddleware, jobController.updateWorkerJobStatus);

module.exports = router; 