const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Submit a review for a worker
router.post('/', auth, reviewController.submitReview);

// Get reviews for a specific worker
router.get('/worker/:workerId', reviewController.getWorkerReviews);

// Get reviews submitted by the logged-in client
router.get('/my', auth, reviewController.getClientReviews);

module.exports = router; 