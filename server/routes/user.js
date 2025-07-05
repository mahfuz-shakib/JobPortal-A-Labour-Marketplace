const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/profile', authMiddleware, userController.updateProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/profile-pic', authMiddleware, userController.uploadProfilePic);
router.post('/delete', authMiddleware, userController.deleteAccount);
router.post('/profile-card', authMiddleware, userController.createOrUpdateProfileCard);

// Add missing routes
router.post('/change-email', authMiddleware, userController.changeEmail);
router.post('/change-password', authMiddleware, userController.changePassword);

// List/search/filter workers
router.get('/workers', userController.getWorkers);
// Get public worker profile by ID
router.get('/worker/:id', userController.getWorkerProfile);

module.exports = router; 