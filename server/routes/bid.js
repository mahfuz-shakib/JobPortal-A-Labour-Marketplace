const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middleware/authMiddleware');

// Get all bids submitted by the logged-in worker
router.get('/my', auth, bidController.getBidsByWorker);
// Get all incoming bids for jobs posted by the logged-in client
router.get('/incoming', auth, bidController.getBidsForClientJobs);
// Get all bids for a specific job (client)
router.get('/job/:jobId', auth, bidController.getBidsForJob);
// Create a new bid (worker)
router.post('/', auth, bidController.createBid);
// Accept or reject a bid (client)
router.patch('/:bidId/status', auth, bidController.updateBidStatus);

module.exports = router; 