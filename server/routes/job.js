const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Create job (client only)
router.post('/', authMiddleware, jobController.createJob);
// Get all jobs
router.get('/', jobController.getJobs);
// Get job by id
router.get('/:id', jobController.getJobById);
// Update job
router.put('/:id', authMiddleware, jobController.updateJob);
// Delete job
router.delete('/:id', authMiddleware, jobController.deleteJob);

module.exports = router; 